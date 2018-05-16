import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

Vue.http.interceptors.push((request, next) => {
    /*
    * 给所有请求添加头（获取token的请求不需要拦截）
    */
    request.headers.set('Authorization', 'x324');
    request.headers.set('X-CSRF-TOKEN', '');
    request.headers.set('X-Requested-With', 'XMLHttpRequest');
  

  next(response => {
    if(response.ok == true){
      return response;
    }else{
      return response;
    }
  });

})

