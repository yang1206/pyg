//轮播图
window.addEventListener('load', function () {
    var arrow_l = document.querySelector('.arrow-l');
    var arrow_r = document.querySelector('.arrow-r');
    var focus = document.querySelector('.focus');
    var focusWidth = focus.offsetWidth;
    focus.addEventListener('mouseenter', function () {
        arrow_l.style.display = 'block';
        arrow_r.style.display = 'block';
        clearInterval(timer);
        timer = null; //清除定时器变量
    })
    focus.addEventListener('mouseleave', function () {
        arrow_l.style.display = 'none';
        arrow_r.style.display = 'none';
        timer = setInterval(function () {
            //手动调用点击事件
            arrow_r.click();
        }, 2000);
    })
    //3.动态生成小圆圈   有几张图片  我就生成几个小圆圈
    var ul = focus.querySelector('ul');
    var ol = focus.querySelector('.circle');
    for (var i = 0; i < ul.children.length; i++) {
        //创建一个小li
        var li = document.createElement('li');
        //记录当前小圆圈的索引号 通过自定义属性
        li.setAttribute('index', i);
        //把小li插入ol里面
        ol.appendChild(li);
        //4.小圆圈的排他思想  我们可以直接在生成小圆圈的同时直接绑定点击事件
        li.addEventListener('click', function () {
            //干掉所有人  把所有的小li  清除  current  类名
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            //留下我自己  当前的小li  设置current  类名
            this.className = 'current';
            // 5.点击小圆圈，移动图片 移动的是ul
            // ul的移动距离  小圆圈的索引号  乘以 图片的宽度 注意是负值
            // 当我们点击了某个小li  就拿到当前小li的索引号
            var index = this.getAttribute('index');
            //当我们点击了某个小li 就要把这个li 的索引号给num
            num = index;
            //当我们点击了某个小li 就要把这个li 的索引号给circle
            circle = index;


            animate(ul, -index * focusWidth);
        })
    }
    //把ol里面的第一个li设置类名为current
    ol.children[0].className = 'current';
    //6.克隆第一张图片(li)放到ul最后面
    var first = ul.children[0].cloneNode(true);
    ul.appendChild(first);
    //7.点击右侧按钮.  图片滚动一张
    var num = 0;
    // circle控制小圆圈的播放
    var circle = 0;
    //flag 节流阀
    var flag = true;
    arrow_r.addEventListener('click', function () {
        if (flag) {
            flag = false; //关闭节流阀
            //如果走到了最后复制的一张图片，此时  我们的ul要快速复原  left
            if (num == ul.children.length - 1) {
                ul.style.left = 0;
                num = 0
            }
            num++;
            animate(ul, -num * focusWidth, function () {
                flag = true; //打开节流阀
            });
            //8.点击右侧按钮，小圆圈跟随一起变化  可以再声明一个变量控制小圆圈的变化
            circle++;
            //如果circle==4  说明走到最后我们克隆得这张图片了
            if (circle == ol.children.length) {
                circle = 0;
            }
            // 调用函数
            circleChange();
        }
    });
    //9.左侧按钮
    arrow_l.addEventListener('click', function () {
        if (flag) {
            flag = false;
            //如果走到了最后复制的一张图片，此时  我们的ul要快速复原  left
            if (num == 0) {
                num = ul.children.length - 1;
                ul.style.left = -num * focusWidth + 'px';

            }
            num--;
            animate(ul, -num * focusWidth, function () {
                flag = true;
            });
            //点击左侧按钮，小圆圈跟随一起变化  可以再声明一个变量控制小圆圈的变化
            circle--;
            //如果circle < 0  说明第一张图片，则小圆圈要改为第四个小圆圈（3）
            // if(circle < 0){
            //     circle = ol.children.length - 1;
            // }
            circle = circle < 0 ? ol.children.length - 1 : circle;
            //调用函数
            circleChange();
        }

    });

    function circleChange() {
        //先清除其余小圆圈的current类名
        for (var i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
        }
        //留下当前的小圆圈的current类名
        ol.children[circle].className = 'current';
    }
    //10.自动播放轮播图
    timer = setInterval(function () {
        //手动调用点击事件
        arrow_r.click();
    }, 2000);
})

//电梯导航
$(function () {
    //当我们点击了li 此时不需要执行 页面滚动事件里面的li 的背景选择 添加current
    //节流阀  互斥锁
    var flag = true;



    //1.显示隐藏电梯导航
    var toolTop = $(".recommend").offset().top;
    toggleTool();
    function toggleTool() {
        if ($(document).scrollTop() >= toolTop) {
            $(".fixedtool").fadeIn();
        } else {
            $(".fixedtool").fadeOut();
        };
    }
    $(window).scroll(function () {
        toggleTool();
        //3.页面滚动到某个内容区域，左侧电梯导航小li相应添加和删除current类名
        if(flag){
            $(".floor .w").each(function (i, ele) {
                if ($(document).scrollTop() >= $(ele).offset().top) {
                    $(".fixedtool li").eq(i).addClass("current").siblings().removeClass("current");
                }
            })
        }
    });
    
    //2.点击电梯导航页面可以滚动到相应内容区域
    $(".fixedtool li").click(function () {
        flag = false;
        console.log($(this).index());
        //当我们每次点击小li  就需要算出页面要去往的位置
        //选出对应索引号的内容区的盒子   计算它的.offset().top
        var current = $(".floor .w").eq($(this).index()).offset().top
        //页面动画滚动效果
        $("body,html").stop().animate({
            scrollTop: current
        },function(){
            flag = true;
        });
        // 点击之后，让当前的小li添加current 类名，姐妹移除current类名
        $(this).addClass("current").siblings().removeClass("current");
    })
    
})