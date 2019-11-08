from django.db import models
import datetime

class Ali(models.Model):
    num = models.CharField(
        verbose_name='商品ID',
        max_length=300,
    )
    data = models.TextField(
        verbose_name='商品信息',
    )
    title = models.TextField(
        verbose_name='标题',
        default = None,
    )
    stock = models.CharField(
        verbose_name='库存',
        max_length=300,
        default=None,
    )
    showimg = models.TextField(
        verbose_name='展示图片',
        default = None,
    )
    type = models.CharField(
        verbose_name='状态',
        max_length=300,
        default=None,
    )
    dict = models.TextField(
        verbose_name='Wish数据',
        default=None,
    )
    def __str__(self):
        return self.num

    class Meta:
        verbose_name = "商品列表"
        verbose_name_plural = "商品列表展示"

class Ali_Prepare(models.Model):
    num = models.CharField(
        verbose_name='商品ID',
        max_length=300,
    )
    data = models.TextField(
        verbose_name='商品信息',
    )
    title = models.TextField(
        verbose_name='标题',
        default=None,
    )

    def __str__(self):
        return self.num

    class Meta:
        verbose_name = "准备保存列表"
        verbose_name_plural = "准备保存展示"