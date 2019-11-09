from django.contrib import admin
from django.urls import path,include,re_path
from . import views
import Ali

urlpatterns = [
    path('',views.index),
    path('create/',views.create),
    path('find/',views.get_data),
    path('del/',views.del_data),
    path('detalis/', views.deta),
    path('find_sql/', views.find_sql),
    path('save/',views.save),
    path('login/',views.login),
    path('sel/',views.sel),
    path('sel2/', views.sel2),
    path('save2/', views.save2),
    path('edit/', views.edit),
    path('Prepare/', views.Prepare),
    path('type/', views.type),
    path('Json/', views.Json),
    path('Traversy/', views.Traversy),
    path('checked_csv/', views.checked_csv),
    path('download_csv/', views.download_csv),
    path('wish/', views.wish),
    path('checked-wish-csv/', views.checked_wish_csv),
    re_path('json/api/(\d+)', views.order_json),
    path('img/', views.imgViews),
    path('show_img/', views.change_show),
    path('country/', views.country),

]