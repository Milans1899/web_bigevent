$(function() {
    // 点击去注册账号
    $('#link_reg').on("click", function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        //点击去登录链接
    $('#link_login').on('click', function() {
            $('.login-box').show();
            $('.reg-box').hide();
        })
        //获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()调用自定义校验规则
    form.verify({
            //自定义pwd校验规则
            pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
            // 校验两次密码是否一致
            repwd: function(value) {
                // 通过形参拿到确认密码框中那日容
                // 判断失败，return一个错误提示消息
                var pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return '两次密码输入不一致！'
                }
            }
        })
        //监听注册表单提交事件
    var data = {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
    }
    $('#form_reg').on('submit', function(e) {
            e.preventDefault();
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);

                }
                layer.msg(res.message);
                // 模拟‘去登陆’的点击行为
                $('#link_login').click();
            })

        })
        //监听登录表单提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 将登陆成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                    //跳转到后台主页
                location.href = 'index.html'
            }
        })
    })
})