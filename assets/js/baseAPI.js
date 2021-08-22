//每次调用get post ajax时会先调用这个函数,这个函数中可以拿到Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log(options.url);

})