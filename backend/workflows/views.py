from django.shortcuts import render
from django.db.models import Q
from rest_framework import viewsets, serializers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Workflow, Node, WorkflowExecution
from .serializers import WorkflowSerializer, NodeSerializer, WorkflowExecutionSerializer
from .tasks import run_workflow

class WorkflowViewSet(viewsets.ModelViewSet):
    serializer_class = WorkflowSerializer
    permission_classes = [AllowAny]  # Temporarily allow all for demo
    queryset = Workflow.objects.all()

    def get_queryset(self):
        # Return all workflows for demo purposes
        return Workflow.objects.all()

    def perform_create(self, serializer):
        # Skip user assignment for demo
        serializer.save()

    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        workflow = self.get_object()
        execution = WorkflowExecution.objects.create(
            workflow=workflow,
            status='pending'
        )
        run_workflow.delay(workflow.id, execution.id)
        return Response({
            "status": "Workflow execution started",
            "execution_id": execution.id
        })

class NodeViewSet(viewsets.ModelViewSet):
    serializer_class = NodeSerializer
    permission_classes = [AllowAny]  # Temporarily allow all for demo
    queryset = Node.objects.all()

    def get_queryset(self):
        # Return all nodes for demo purposes
        return Node.objects.all()

    def perform_create(self, serializer):
        # Skip user validation for demo
        serializer.save()


class WorkflowExecutionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WorkflowExecution.objects.all()
    serializer_class = WorkflowExecutionSerializer
    permission_classes = [AllowAny]  # Temporarily allow all for demo

    def get_queryset(self):
        # Return all executions for demo purposes
        return self.queryset.all()