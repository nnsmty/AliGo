# Generated by Django 2.2.6 on 2019-11-07 03:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ali', '0008_ali_stock'),
    ]

    operations = [
        migrations.AddField(
            model_name='ali',
            name='dict',
            field=models.TextField(default=None, verbose_name='Wish数据'),
        ),
    ]