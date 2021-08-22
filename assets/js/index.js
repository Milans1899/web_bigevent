$(function() {
        getUserInfo();
        var layer = layui.layer;
        //点击按钮实现退出功能
        $('#btnLogout').on('click', function() {
            // 提示用户是否退出
            layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
                //do something
                //清空token  跳转至登录页
                localStorage.removeItem('token');
                location.href = 'login.html';
                // 关闭comfirm框
                layer.close(index);
            });
        })
    })
    //获取用户基本信息函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers:请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用渲染用户头像
            renderAvatar(res.data);
        },
    })
}
//渲染用户头像函数
function renderAvatar(user) {
    //获取用户昵称
    var name = user.nickname || user.username;
    //设置欢迎文本
    $('#welcome').html('欢迎&nbsp&nbsp' + name);
    //按需渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //渲染昵称文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    };
}