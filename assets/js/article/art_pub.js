$(function() {
    var layer = layui.layer;
    var form = layui.form;
    //定义加载文章分类的方法
    initCate();
    // 初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('文章类别加载失败！')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id').html(htmlStr);
                //重新渲染页面的DOM元素
                form.render();
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
        // 2. 裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        // 3. 初始化裁剪区域
    $image.cropper(options)
        //为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click();
        })
        //监听coverFile的change事件获取文件选择雷彪
    $('#coverFile').on('change', function(e) {
            var files = e.target.files
                // 判断用户是否选择了文件
            if (files.length === 0) {
                return
            }
            //根据文件，创建对应的URL地址
            var newImgURL = URL.createObjectURL(files[0])
                //为裁剪区重新设置图片
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 定义文章发布状态
    var art_state = '已发布'
        // 存为草稿按钮，绑定点击事件
    $('#btnSave2').on('click', function() {
            art_state = '草稿'
        })
        // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        // 基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0])
            // 将文章发布状态加入fd中
        fd.append('state', art_state);
        // 将封面裁剪过后图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // fd.forEach(function(value, key) {
                //     console.log(value, key);

                // })
                // 发起ajax请求，发送数据至服务器
                publishiArticle(fd);
            });
    })

    function publishiArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意向服务器提交FormData格式数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！');
                // 发布成功后跳转到发布页面
                location.href = '/article/art_list.html'
            }
        })
    }
})