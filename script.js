// ==UserScript==
// @name         Ticket48
// @version      1.0
// @description  48抢票脚本
// @author       peer
// @include      *://shop.48.cn/tickets/item/*
// @include      *://shop.48.cn/goods/item/*
// @include      *://shop.48.cn/Goods/Item/*                                                                                        
// @include      *://shop.48.cn/order/buy
// @include      *://shop.48.cn/*
// @grant        none
// @required     http://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==

$(function() {
  'use strict'
  var seatTypeSelect = `
<select id="seatTypeSelcet" class="form-control" style="width: 60px;height:40px;margin-left:10px;text-align-last:center;">
  <option value="2">VIP</option>
  <option value="3">普坐</option>
  <option value="4">站票</option>
</select>
`
  
  var grabScript = `
<script>

  function _timeFormat (date) {
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    var time = hours + ':' + minutes + ':' + seconds
    return time
  }


  function goToCart () {
    $("#addcart").attr("action", "/order/buy")
    $("#addcart").submit()
  }


  function grabTicket () {
    var now = new Date()
    var beginTime = new Date(now.getTime())
    var jlTime = new Date(now.getTime())
    beginTime.setHours(19)
    beginTime.setMinutes(59)
    beginTime.setSeconds(59)
    jlTime.setHours(20)
    jlTime.setMinutes(29)
    jlTime.setSeconds(29)
    var buttonType = $('a#grabTicket').text()
    if (buttonType === '抢票') {
      excuteTask(beginTime, _loop, _buy, 500)
    } else {
      excuteTask(jlTime, _loopJL)
    }
  }


  function grabLencan () {
    var now = new Date()
    var beginTime = now
    beginTime.setHours(19)
    beginTime.setMinutes(59)
    beginTime.setSeconds(57)
    if ($("span.sp_list_6a.kb").children("a").text().indexOf('生日会') != -1) {
      excuteTask(beginTime, _loop, _orderBuy, 200)
    }
  }


  function excuteTask (beginTime, task, loopTask=null, interval) {
    layer.msg('脚本开始倒计时，请勿关闭当前页面', {time: 5000})
    var endTime = new Date(beginTime.getTime())
    endTime.setMinutes(endTime.getMinutes() + 2)
    endTime.setSeconds(0)
    beginTime = _timeFormat(beginTime)
    endTime = _timeFormat(endTime)
    console.log(endTime)
    var timer = setInterval(function () {
      var now = _timeFormat(new Date())
      if (now >= beginTime) {
        clearInterval(timer)
        if (loopTask !== null) {
          task(loopTask, endTime, interval)
        } else {
          task()
        }
      }
    }, 1000)
  }


  function _loopJL () {
    layer.msg('捡漏ing...')
    var count = 0
    var timer = setInterval(function () {
      var res = _buy()
      if (res === 'wait'){
        clearInterval(timer)
      }
      if (res.indexOf('库存不足') != -1 || count === 20) {
        clearInterval(timer)
        layer.msg('遗憾...你的脸太黑了')
      }
      count++
    }, 1000)
  }


  function _loop (_loopTask, endTime, interval) {
    var msg = ''
    if (_loopTask.name == '_buy') {
      msg = '抢票ing...'
    } else if (_loopTask.name == '_orderBuy') {
      msg = '抢冷餐ing...'
    }
    layer.msg(msg)
    var timer = setInterval(function () {
      var result = _loopTask()
      var now = _timeFormat(new Date())
      if (now >= endTime || result === 'wait') {
        clearInterval(timer)
        layer.msg('loop done (' + result + ')')
      }
    }, interval)
  }


  function _check (type, count=1) {
    var _url = ''
    var _id = -1
    if (type === 'ticket') {
      _url= "/TOrder/tickCheck"
      _id = location.pathname.split('/tickets/item/')[1]
    } else if (type === 'lencan') {
      _url= "/TOrder/orderCheck"
      _id = $("#goods_id").val()
    }

    $.ajax({
      url: _url,
      type: "GET",
      dataType: "json",
      data: {
        id: _id,
        r: Math.random()
      },
      success: function (result) {
        if (result.HasError) {
          layer.msg(result.Message + ' error! retrying...')
          setTimeout(_check(type, count), 2000)
        } else {
          switch(result.ErrorCode) {
            case "success":
              window.location.href = result.ReturnObject
              break
            case "wait":
              layer.msg('查询结果中...')
              setTimeout(_check(type, count), 2000)
              break
            case "fail":
              layer.msg(result.Message + ' (遗憾...你的脸太黑了)', {time: 10000})
              break
            default:
              layer.msg('查询结果中...')
              setTimeout(_check(type, count), 2000)
          }
        }
      },
      error: function (e) {
        count++
        layer.closeAll()
        layer.msg("您排队失败, 正在重试,错误代码:162002")
        if (count <= 20) {
          setTimeout(_check(type, count), 2000)
        }
      }
    })
  }


  function _buy(){
    //设置购买数量
    var _num=1

    var _urlAdd = "/TOrder/add"
    var _id = location.pathname.split('/tickets/item/')[1]

    var title = $("li.i_tit").text()
    
    var _seattype = $("#seatTypeSelcet option:selected").val()
    
    if (title.indexOf('上海') != -1) {
      _brand_id = "1"
    } else if (title.indexOf('北京') != -2) {
      _brand_id = "2"
    } else {
      _brand_id = "3"
    }

    var msg
    $.ajax({
      url: _urlAdd,
      type: "POST",
      dataType: "json",
      async:false,
      data: {
        id: _id,
        num: _num,
        seattype: _seattype,
        r: Math.random(),
        brand_id: _brand_id,
        choose_times_end: -1,
        brand_id: _brand_id
      },
      success: function (result) {
        if (result.HasError) {
          layer.msg(result.Message + ' (has error of buy)')
          msg = result.Message
        } else {
          if(result.Message =="success") {
            window.location.href = result.ReturnObject
          } else {
            _check('ticket')
          }
          msg = 'wait'
        }
      },
      error: function (e) {
        layer.msg("下单异常,请刷新重试")
        msg = 'loop'
      }
    })
    return msg
  }


  function _orderBuy () {
    var AddressID = $("#AddressID").val()
    var goods_amount = 0
    var shipping_fee = 0
    var goods_id = $("#goods_id").val()
    var attr_id = $("#attr_id").val()
    var num = 1
    var sumPayPrice = 0.00
    var is_inv = false
    var lgs_id = 12
    var integral = 800
    var IsIntegralOffsetFreight = false

    var msg
    $.ajax({
      url: "/Order/BuySaveForGive",
      type: "post",
      dataType: "json",
      async:false,
      data: {
        AddressID: AddressID,
        goods_amount: goods_amount,
        shipping_fee: shipping_fee,
        goods_id: goods_id,
        attr_id: attr_id,
        num: num,
        sumPayPrice: sumPayPrice,
        is_inv: is_inv,
        lgs_id: lgs_id,
        integral: integral,
        IsIntegralOffsetFreight: IsIntegralOffsetFreight,
        r: Math.random()
      },
      success: function(result) {
        if (result.HasError) {
          layer.msg(result.Message + "<br/>错误代码:" + result.ErrorCode);
          msg = result.Message
        } else {
          if (result.Message == "wait") {
            _check('lencan')
            msg = 'wait'
          } else {
            location.href = result.ReturnObject
          }
        }
      },
      error: function(e) {
        layer.msg("下单超时");
        msg = 'loop'
      }
    })
    return msg
  }

</script>`
  

  // 全局加载脚本
  if (window.location.hostname == 'shop.48.cn' && window.location.pathname.length == 1) {
    layer.msg(`已经加载抢票与抢冷餐脚本，请确保操作有足够的前置时间，勿卡点操作`,
              {
                time: 5000,
                closeBtn: 1
              })
  }
  
  $("body").append(grabScript)
  
  var now = new Date()
  var day = now.getDay()
  var hour = now.getHours() > 10 ? now.getHours() : '0' + now.getHours
  var minute = now.getMinutes() > 10 ? now.getMinutes() : '0' + now.getMinutes
  now = hour + ':' + minute + ':' + '00'
  
  // 抢票脚本
  var title = $("li.i_tit").text()
  if (title.indexOf('星梦剧院') != -1) {
    layer.msg(`已经加载抢票脚本，脚本将会在20:00:00开始尝试，
               请于抢票开始前两分钟左右点击抢票按钮，
               请确保网络通畅，点击抢票按钮后请勿关闭当前页面，
               20:20:00 后转为捡漏脚本`,
              {
                time: 5000,
                closeBtn: 1
              })
    var grabButton = `<a href="javascript:void(0)" id="grabTicket" class="pink_sc" onclick="grabTicket()" style="background-color:#dc3545">抢票</button>`
    $("a#buy").parent().append(grabButton)
    
    if (now > '20:20:00') {
      $("a#grabTicket").text('捡漏')
    }
    $("a#buy").parent().append(seatTypeSelect)
  }
  
  // 冷餐脚本
  if (title.indexOf('生日会') != -1) {
    layer.msg(`请点击提前进入购物车按钮，进入提交订单页面`,
              {
                time: 4000,
                closeBtn: 1
              })
    var addCartButton = `<a href="javascript:void(0)" id="goToCart" class="pink_sc" onclick="goToCart()" style="margin-left:10px;background-color:#dc3545">提前进入购物车</button>`
    $("a.addCollect").parent().append(addCartButton)
    
    if (now >= '19:58:00' && day == 2) {
      $('#goToCart').click()
    }
  }
  if (window.location.pathname == '/order/buy' && $("span.sp_list_6a.kb").children("a").text().indexOf('生日会') != -1) {
    layer.msg(`已经加载抢冷餐脚本，脚本将会在20:00:00开始尝试，
               请于抢票开始前两分钟左右点击抢冷餐按钮，
               请确保网络通畅，点击抢票按钮后请勿关闭当前页面，
               也可以选择手动提交订单，注意卡点提交`,
              {
                time: 5000,
                closeBtn: 1
              })
    var lencanButton = `<button type="button" id="grabLencan" class="fbold" onclick="grabLencan()" style="margin-right:10px;background-color:#dc3545">抢他妈的冷场</button>`
    $("span.tj_5").append(lencanButton)
    
    if (now >= '19:58:00' && day == 2) {
      $('#grabLencan').click()
    }
  }
})

