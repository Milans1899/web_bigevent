$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)
            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())
            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss;
        }
        // 定义补零函数
    function padZero(n) {
        n > 9 ? n : '0' + n
    }
    //定义查询的参数对象,需要将请求对象发送到服务器
    var q = {
        pagenum: 1, //页码值，默认第一页
        pagesize: 2, //每页显示几条数据，默认2条
        cate_id: '', //文章分类的Id
        state: '' //文章分类的发布状态
    };
    //初始化表格数据
    initTable();
    //初始化分类下拉表单数据
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模版引擎渲染页面数据
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                //表格渲染后渲染分页
                renderPage(res.total);
            }
        })
    }
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                //调用模版引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //通过layui重新渲染表单区的UI结构
                form.render();
            }
        })
    }
    //筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //查询参数对象q赋值
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });
    // 定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认选中第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换时候触发jump函数
            //1.点击页码触发jump回调
            //2.调用laypage.render()函数触发
            jump: function(obj, frist) {
                //通过frist值，判断那种方式触发jump回调，如果frist值为true为方式2触发，否则方式1触发
                // 把最新页码赋值到q查询参数对象中
                q.pagenum = obj.curr;
                // 把最新条目数，赋值到q的pagesize中
                q.pagesize = obj.limit;
                // 根据最新的q获取数据，并渲染表格
                if (!frist) {
                    initTable();
                }
            }
        });
    }
    //通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        //获取删除按钮个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id');
        //询问用户是否删除数据的弹出层
        layer.confirm('确认删除', {
            icon: 3,
            title: '提示'
        }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        // 当数据删除完成后，判断当前页是否有剩余数据，如果没有页码值-1

                    if (len === 1) {
                        q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                    layer.close(index);
                }
            })

        })
    })
})