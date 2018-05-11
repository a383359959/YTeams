$(function(){

    loadData();

    var id = 0;

    $('.create').bind('click',function(){
        box('show');
    });

    $('.save').bind('click',function(){
        var text = $(this).text();
        if(text == '保存'){
            var name = $('.pro_name').val();
            var id = $(this).attr('id');
            var args = {
                id : id,
                name : name
            }
            ajax('project/edit',args,true,function(result){
                loadData();
                box('hide');
            });
        }else{
            var name = $('.pro_name').val();
            var args = {
                name : name
            }
            ajax('project/add',args,true,function(result){
                loadData();
                box('hide');
            });
        }
    });

    $(document).on('click','.setting',function(){
        var name = $(this).attr('name');
        var id = $(this).attr('id');
        $('.save').attr('id',id);
        $('.title').text('修改项目');
        $('.pro_name').val(name);
        box('show');
    });

    $(document).on('click','.del',function(){
        id = $(this).attr('id');
        $('.model_bg,.confirm').show();
    });

    $('.confirm_close').bind('click',function(){
        $('.model_bg,.confirm').hide();
    });

    $('.confirm_success').bind('click',function(){
        $('.model_bg,.confirm').hide();
        ajax('project/del',{id : id},true,function(result){
            if(result.code == 1) loadData();
        });
    });

    function loadData(){
        ajax('project/lists',{},true,function(result){
            if(result.code == 1) $('.user_item li:first').text(result.data.member_name);
            if(result.code == 1 && result.data.list.length > 0){
                var html = '';
                for(var i = 0;i < result.data.list.length;i++){
                    var row = result.data.list[i];
                    html += '<li onclick="window.location.href = \'detail.html\'"><i id="' + row.id + '" class="del"><img src="images/del.jpg" /></i><img src="images/computer.jpg" /><p>' + row.name + '</p><div class="pro_list_btn"><a href="javascript:;">控制台</a><a href="javascript:;" id="' + row.id + '" name="' + row.name + '" class="setting">设置</a></div></li>';
                }
                $('.pro_list_empty').hide();
                $('.pro_list ul').html(html);
            }else{
                $('.pro_list_empty').show();
                $('.pro_list ul').html('');
            }
        });
    }

    function box(type){
        if(type == 'show'){
            $('.model_bg,.add_project').show();
        }else{
            $('.title').text('创建项目');
            $('.pro_name').val('');
            $('.model_bg,.add_project').hide();
        }
    }

});