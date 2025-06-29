# Generated by Django 5.1.6 on 2025-06-18 17:50

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("workflows", "0005_alter_nodeconnection_source_node_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="workflow",
            options={"ordering": ["-updated_at"]},
        ),
        migrations.AddField(
            model_name="workflow",
            name="definition",
            field=models.JSONField(
                default=dict,
                help_text="ReactFlow workflow definition (nodes, edges, viewport)",
            ),
        ),
        migrations.AddField(
            model_name="workflow",
            name="description",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="workflow",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="workflow",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="workflows",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddIndex(
            model_name="workflow",
            index=models.Index(
                fields=["user", "-updated_at"], name="workflows_w_user_id_bf63ca_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="workflow",
            index=models.Index(
                fields=["user", "is_active"], name="workflows_w_user_id_281260_idx"
            ),
        ),
    ]
