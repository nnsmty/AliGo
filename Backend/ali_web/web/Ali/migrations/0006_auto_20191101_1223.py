# Generated by Django 2.2.6 on 2019-11-01 04:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ali', '0005_auto_20191101_1155'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='ali_edit',
            options={'verbose_name': '准备保存列表', 'verbose_name_plural': '准备保存列表展示'},
        ),
        migrations.AlterModelOptions(
            name='ali_prepare',
            options={'verbose_name': '修改商品列表', 'verbose_name_plural': '修改商品列表展示'},
        ),
        migrations.AddField(
            model_name='ali_prepare',
            name='showimg',
            field=models.TextField(default=None, verbose_name='展示图片'),
        ),
    ]
