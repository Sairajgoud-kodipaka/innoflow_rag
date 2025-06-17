from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AIModelConfig, ModelComparison
from .serializers import AIModelConfigSerializer, ModelComparisonSerializer
from .utils.openai_provider import OpenAIProvider
from .tasks import run_ai_model_task  # Import the task here
from django.db import transaction
from .permissions import IsOwnerOrReadOnly
from users.utils import log_activity
from celery.result import AsyncResult

class TaskStatusViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'], url_path='status/(?P<task_id>[^/.]+)')
    def get_status(self, request, task_id=None):
        task_result = AsyncResult(task_id)
        return Response({
            'task_id': task_id,
            'status': task_result.status,
            'result': task_result.result
        })

    @action(detail=False, methods=['get'], url_path='result/(?P<task_id>[^/.]+)')
    def get_result(self, request, task_id=None):
        task_result = AsyncResult(task_id)
        if task_result.ready():
            return Response({
                'task_id': task_id,
                'status': task_result.status,
                'result': task_result.result
            })
        return Response({
            'task_id': task_id,
            'status': task_result.status,
            'result': None
        },
            status=status.HTTP_202_ACCEPTED)

class AIModelConfigViewSet(viewsets.ModelViewSet):
    """
    ViewSet for AI model configurations
    """
    queryset = AIModelConfig.objects.all()
    serializer_class = AIModelConfigSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        log_activity(self.request.user, "created_ai_model_config",
                     f"AI Model Config '{serializer.instance.name}' created.")

    def perform_update(self, serializer):
        serializer.save()
        log_activity(self.request.user, "updated_ai_model_config",
                     f"AI Model Config '{serializer.instance.name}' updated.")

    def perform_destroy(self, instance):
        log_activity(self.request.user, "deleted_ai_model_config",
                     f"AI Model Config '{instance.name}' deleted.")
        instance.delete()

    @action(detail=True, methods=['post'], url_path='test-config')
    def test_config(self, request, pk=None):
        config = self.get_object()
        # Here, you would implement the actual logic to test the AI model configuration.
        # This could involve making a small call to the AI model API.
        # For demonstration, we'll just return a success response.
        return Response({'status': 'success', 'message': 'AI model config tested successfully.'})

class ModelComparisonViewSet(viewsets.ModelViewSet):
    queryset = ModelComparison.objects.all()
    serializer_class = ModelComparisonSerializer
    permission_classes = [IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        log_activity(self.request.user, "created_model_comparison",
                     f"Model comparison '{serializer.instance.name}' created.")

    def perform_update(self, serializer):
        serializer.save()
        log_activity(self.request.user, "updated_model_comparison",
                     f"Model comparison '{serializer.instance.name}' updated.")

    def perform_destroy(self, instance):
        log_activity(self.request.user, "deleted_model_comparison",
                     f"Model comparison '{instance.name}' deleted.")
        instance.delete()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        prompt = serializer.validated_data['prompt']
        model_configs = serializer.validated_data['compared_models']
        
        # Create the comparison instance
        comparison = serializer.save()
        
        # Use on_commit to ensure the task runs after the transaction is committed
        # Pass a list of AIModelConfig objects to _run_ai_model_task
        transaction.on_commit(lambda: self._run_ai_model_task(comparison.id, prompt, model_configs))
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def _run_ai_model_task(self, comparison_id, prompt, model_configs):
        for model_config in model_configs:
            run_ai_model_task.delay(
                model_config_id=model_config.id,
                prompt=prompt,
                comparison_id=comparison_id
            )
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        comparison = self.get_object()
        # Just an example response; you can change as needed
        return Response({
            "comparison_id": comparison.id,
            "results": "Dummy results or actual data"
        })

    @action(detail=False, methods=['post'], url_path='compare-models')
    def compare_models(self, request):
        prompt = request.data.get('prompt')
        models = request.data.get('models')
        
        # Create a comparison object
        comparison = ModelComparison.objects.create(prompt=prompt)
        
        # Use on_commit to ensure the task runs after the transaction is committed
        # Pass a list of AIModelConfig objects to _run_ai_model_task
        model_configs = [AIModelConfig.objects.get(id=model_id) for model_id in models]
        transaction.on_commit(lambda: self._run_ai_model_task(comparison.id, prompt, model_configs))
        
        return Response({
            "comparison_id": comparison.id,
            "status": "comparison initiated"
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='run-comparison')
    def run_comparison(self, request, pk=None):
        comparison = self.get_object()
        prompt = request.data.get('prompt')

        if not prompt:
            return Response({'error': 'Prompt is required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Example: Trigger Celery task to run AI models
        task = run_ai_model_task.delay(comparison.id, prompt)

        return Response({
            'status': 'comparison initiated',
            'task_id': task.id
        },
            status=status.HTTP_202_ACCEPTED)
