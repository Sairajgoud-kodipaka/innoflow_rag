# Generated by Django 5.1.6 on 2025-04-18 17:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflows', '0003_add_node_retry_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='workflowexecution',
            name='execution_context',
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name='workflowexecution',
            name='variables',
            field=models.JSONField(default=dict),
        ),
    ]
