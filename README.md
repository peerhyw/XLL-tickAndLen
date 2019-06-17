## 不可说脚本

- 安装chrome，请到官网下载，需翻墙
- chrome安装Tampermonkey扩展
- 

![](/home/peer/myCode/xll-tickandlen/picture/深度截图_选择区域_20190617172022.png)

安装完成后点击添加新脚本

- 打开 <https://github.com/peerhyw/XLL-tickAndLen/blob/master/script.js> 复制脚本代码至Tampermonkey中并保存

- 使用说明

  - 切票

  - ![](/home/peer/myCode/xll-tickandlen/picture/深度截图_选择区域_20190617172631.png)

  - 打开票务页面将有新增的按钮和下拉选择栏，最好是开票前至少3分钟就选定要抢的座位类型并点击抢票按钮，脚本就会自动进行倒计时，点击按钮后不要关闭页面

  

  - 冷餐
  - ![](/home/peer/myCode/xll-tickandlen/picture/深度截图_选择区域_20190617185740.png)
  - 点进冷餐页面，点击提前进入购物车
  - 

  ![](/home/peer/myCode/xll-tickandlen/picture/深度截图_选择区域_20190617194518.png)

  - 点进红色的按钮进行倒计时，点击按钮后不要关闭页面，当然你也可以掐点手动提交订单，反正你已经提前加载到购物车里面了
  - 当时间超过19点58分才打开冷餐页面时会自动跳转到提交订单页面并自动进行倒计时

- 如有需要，以下为多开账户进行切票或切冷餐的操作

  - chrome安装SessionBox扩展
  - ![](/home/peer/myCode/xll-tickandlen/picture/深度截图_选择区域_20190617195205.png)

  - 以游客身份登录
  - ![](/home/peer/myCode/xll-tickandlen/picture/深度截图_选择区域_20190617195449.png)

  - 点击 + 图标多开窗口进行多账户登录，然后每个窗口的账户进行上面同样的切票或切冷餐操作