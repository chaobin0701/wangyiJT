(function(){ //顶部划屏操作
    var scrollWrap = document.querySelector('.scrollWrap'), //获取顶部滑动外层dom
    inner = document.querySelector('.inner') //获取顶部滑动dom


    var startPointX = 0, //按下时手指的坐标
        startLeft = 0, //按下时元素的坐标
        movePointX = 0; //坐标点移动的位置

    inner.style.transform = 'translateX(0px)'; //给初始值 不然获取不到

    scrollWrap.addEventListener('touchstart',function(ev){ //touch(触摸)start(开始) -> 按下
        startPointX = ev.changedTouches[0].pageX; //按下屏幕时候第一根手指的位置
        startLeft = parseInt(inner.style.transform.split('(')[1]); //按下的时候元素的translateX值
    });

    scrollWrap.addEventListener('touchmove',function(ev){ //计算走的距离  move(移动)
        // 手指拖拽的时候触发事件 -> 获取当前第一根手指的x坐标 减去 按下时候的第一根手指的坐标
        movePointX = ev.changedTouches[0].pageX - startPointX; // 手指拖拽的距离
       
        // 元素走的距离  -> 手指拖拽的距离 - 按下的时候元素的translateX值
        var x = movePointX + startLeft; 
  
        // 判断移动是否到头
        if(x >= 0){
            x = 0
            // console.log('left over')
        }else if(x <= scrollWrap.offsetWidth - inner.offsetWidth){
            x = scrollWrap.offsetWidth - innerWidth.offsetWidth
            // console.log('right over')
        }

        //手指移动的时候改变inner的translateX的值进行移动
        inner.style.transform = 'translateX('+ x +'px)';

        ev.preventDefault();//在左右拖拽的时候 取消上下拖拽
    })
    
})();

(function(){ //折叠导航
    var more = document.querySelector('.channel .more span'),
    channel = document.querySelector('.channel'),
    inner = document.querySelector('.inner'),
    shadow = document.querySelector('.shadow');

    var shrink = true; //控制是否折叠的开关

    more.addEventListener('touchend',function(){
        // 检验开关
        if(shrink){
            channel.classList.add('blockChannel');
            shadow.style.display = 'block';
        } else {
            channel.classList.remove('blockChannel');
            shadow.style.display = 'none'
        }

        shrink = !shrink //取反 关闭或者打开开关
    });

    shadow.addEventListener('touchstart',function(ev){
        ev.preventDefault(); //在点开折叠页面的时候 无法在shadow上滑动页面
    })
})();

(function(){ //轮播图
    var banner = document.querySelector('.banner'), //轮播图外层框架
    wrap = document.querySelector('.wrap'),  // 轮播图框架
    circles = document.querySelectorAll('.banner .circle span'), //小圆点
    imgWidth = banner.offsetWidth; // 获取一个图片的宽度    

var startPointX = 0, //按下的时候的坐标
    startLeft = 0, //开始的left值
    movePointX = 0, //移动的时候的坐标
    cn = 0, //当前的索引
    ln = 0, //上一个索引
    timer = null; //定时器

    //初始化
    wrap.innerHTML += wrap.innerHTML; //复制一份图片
    var len = wrap.children.length; //子元素的数量
    wrap.style.width = len * 100 + 'vw';
    wrap.style.transform = 'translateX(0px)';



    /* 触摸开始  
    1.停止定时器  
    2.关闭过度  
    3.if判断当前索引  
        若cn = 0 则当前图片为第一张 改变索引为len / 2 , 变换到索引为8的位置
        若cn = 15 则当前图片为最后一张 改变索引为len / 2 - 1 ,变换索引为7的位置
        注意:数组的索引从0开始,此轮播图一共为8张，也就是索引为7的时候 图片就是最后一张
    4.改变图片的位置到当前索引的位置 若不经历上述两处执行语句 cn则不边
    5.获取手指点击的位置 以便计算 */
    banner.addEventListener('touchstart' , function(ev){
        clearInterval(timer);
       
    
        //手指按下时候 通过if判断 如果是第一张和最后一张就改变当前的位置 
        //先改变过度为null 然后改变位置
        wrap.style.transition = 'null';
        if(cn == 0){ //按下的是第0张，如果往右走就会出现空白
            cn = len / 2;
        }
        if(cn == len - 1){ //按下的是最后一张，如果往左走就会出现空白
            cn = len / 2 -1;
        }
        console.log(cn)

        wrap.style.transform = 'translateX(' + -cn * imgWidth + 'px)';
       
        //获取手指点击的位置
        startPointX = ev.changedTouches[0].pageX;
        startLeft = parseInt(wrap.style.transform.split('(')[1]);
     });

    /*手指移动
    1.计算手指拖动的距离
    2.改变图片的位置 （跟着手动）
    */
     banner.addEventListener('touchmove',function(ev){
        movePointX = ev.changedTouches[0].pageX - startPointX; //计算手指拖动的距离
        wrap.style.transform = 'translateX(' + (movePointX + startLeft) + 'px)';  //改变图片的位置
     });
    
    /*手指抬起
    1.计算手指拖拽的距离
    2.设定回弹距离
    3.判断回弹距离 并改变索引
        若超过回弹距离 根据拖拽的方向变换图片到 上一张 或者 下一张
         cn -= movePointX / Math.abs(movePointX);  （cn 为当前索引 ）
        计算 movePointX / Math.abs(movePointX) 也就是把拖拽距离 除于 拖拽距离的绝对值
            假设cn =5 向左拖拽100px cn -= -100 / 100  
            相当于 cn = 5 - -100 / 100  cn变为6
    4.根据改变后的索引改变图片当前的位置
    5.判断小圆点的选中
        创建hn 值为cn & len / 2
        将circles[ln] 的 小圆点class 清空
        将circles[hn] 的 小圆点class 加上 active
        将 hn 赋值给 ln    */
     banner.addEventListener('touchend',function(ev){
         movePointX = ev.changedTouches[0].pageX - startPointX; //手指拖拽的距离
    
        /* cn++; */
        //判断是否回弹 如果拖拽距离超过设定 就改变当前索引的值
        var backWidth = imgWidth / 6; //回弹的距离
        if(Math.abs(movePointX) > backWidth ){ //这个条件成立说明拖拽的距离超过了回弹的值，要走到下一张
            cn -= movePointX / Math.abs(movePointX);
        }

        wrap.style.transition = '.3s';
        wrap.style.transform = 'translateX('+-cn * imgWidth +'px)' ;//改变位置的值
    
        /*
            cn: 0 1 2 3 4 5 6 7 8 9 10 11 12 13...
                0 1 2 3 4 5 6 7 0 1 2  3  4  5
        */
       var hn = cn % (len / 2);
    
       console.log(cn,len,hn, len / 2)
       circles[ln].className = '';
       circles[hn].className = 'active';
       ln = hn;
    
        timer = setInterval(move , 3000)
    
    
     });

     /*定时器
     1.cn++
     2.改变图片当前的位置
     3.过度完成事件 transitionend 
        3.1.1判断cn > len -1 (到头了) 若成立 则改变 cn 的值为 len / 2 -1
        3.1.2关闭过度，改变轮播图的位置

        3.2.1.判断小圆点的选中
            创建hn 值为cn & len / 2
            将circles[ln] 的 小圆点class 清空
            将circles[hn] 的 小圆点class 加上 active
            将 hn 赋值给 ln   */
     function move() {
        cn++;

        wrap.style.transition = '.3s';
        wrap.style.transform  = 'translateX(' + -cn * imgWidth + 'px)';

       // 过度完成出发事件: transitionend 作用:改变索引的值 
        wrap.addEventListener('transitionend',function(){
            if(cn > len -1 ){
                cn = len / 2 - 1;
            }
            wrap.style.transition = 'null';
            wrap.style.transform = 'translateX(' + -cn * imgWidth + 'px)';
            
            var hn = cn % (len / 2);
            circles[ln].className = '';
            circles[hn].className = 'active';
            ln = hn;
        })
    }

    //系统执行js代码 开启定时器
    timer = setInterval(move ,3000);
})();

  // 回到顶部
 (function () {
    var backTop = document.querySelector('.backTop');

    window.onscroll = function () {
        var top = window.pageYOffset; //滚动条走的距离
        backTop.style.opacity = top > 600 ? 1 : 0;
    }

    backTop.addEventListener('touchend', function () {
        window.scrollTo(0, 0);  //回到顶部
    })
})();


var btnSearch = document.querySelector('.search')
btnSearch.addEventListener('click',function(){
    window.location.href="./html/search.html"
})
