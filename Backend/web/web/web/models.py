from django.db import models
import datetime

# Create your models here.
class Ali(models.Model):
    ID = models.CharField(
        verbose_name='商品ID',
        max_length=300,
    )
    data = models.TextField(
        verbose_name='商品信息',
    )

    # title = models.CharField(
    #     verbose_name='文章标题',
    #     max_length=300,
    # )
    #
    # biref = models.CharField(
    #     verbose_name='简介',
    #     max_length=50,
    #     default=None
    # )
    #
    # text =  models.TextField(
    #     verbose_name='文章内容'
    # )
    # read = models.IntegerField(
    #     verbose_name='阅读',
    #     default=0
    # )
    # img = models.CharField(
    #     verbose_name="背景图片",
    #     max_length=500,
    # )
    #
    # time = models.DateField(
    #     default=datetime.date.today()
    # )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "商品列表"
        verbose_name_plural = "商品列表展示"