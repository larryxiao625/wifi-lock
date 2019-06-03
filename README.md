## 智能门锁
### 架构
使用小程序自有框架+PHP+MYSQL

### 前端小程序
* *.js为小程序javascript逻辑代码，*.wxml为小程序页面文件（相当于HTML），*.wxss为小程序样式表(相当于CSS)
* PAGES目录存放界面文件
* IMAGES目录存放使用图片资源文件
* CLOCK目录存放小程序云函数，用来获取用户OPENID
* 其余文件皆为小程序自有框架配置文件，详见：[小程序配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html)

#### PAGES
PAGES现有使用功能代码在**devices/index/**,**devices/manage/**,**devices/show/**,**/history/**,**login/**

------

#### login
主要进行小程序登录逻辑
登录验证请求地址为:[https://www.happydoudou.xyz/public/index.php/User/login](https://www.happydoudou.xyz/public/index.php/User/login)
* data
    + isScuess:是否登录成功
    + canIuse：小程序基础库能否使用云函数
    + hasUserInfo：是否用用户数据
    + name：用户名
    + stuId：密码
* js
    + formSubmit主要进行登录验证，post数据（name，pwd，openid）进行验证,此时分两种情况
        - 若数据库中无PENID，则登录成功，自动跳转到首页
        - 若数据库中无用户OPENID，则要求用户输入账户密码，若登录成功，则跳转小程序首页的同时将用户OPENID存入数据库，为后面实现自动登录

* WXML
    + 使用INPUT和button小程序自有框架构造界面

#### devices/index/
主要进行门锁首页，无特殊逻辑，将门锁按钮绑定跳转到主要逻辑界面

#### devices/show
小程序主要开锁门逻辑及用户管理逻辑，现设置指纹，设置密码
开关门请求地址为[https://www.happydoudou.xyz/public/index.php/lock/open](https://www.happydoudou.xyz/public/index.php/lock/open)
开门次数请求地址为[https://www.happydoudou.xyz/public/index.php/lock/getLockTime](https://www.happydoudou.xyz/public/index.php/lock/getLockTime)
门锁状态请求地址为[https://www.happydoudou.xyz/public/index.php/lock/getLockStatus](https://www.happydoudou.xyz/public/index.php/lock/getLockStatus)

* JS
    + onShow在此界面每一次展示时候调用
        - **wx.getConnectedWifi**每一次启动的时候获取wifi名字，并设置到DATA中，以备后面POST使用
        - **setInterval**方法进行轮询，没一秒执行一次，分别有wx.request请求getLockTime获取登录次数，并更新到界面中，wx.request请求getLockStatus获取锁的状态，并更新到界面
    + bleOpenDoor点击开关门按钮时调用，wx.request请求open方法，发送用户openid和wifi_name,openid主要用于后台记录是哪个用户进行的操作，wifi_name主要用于检测wifi名字是否和锁所在wifi一致，一致才进行开锁
    + confirm方法主要用于点击添加用户时，点击提交后post到数据库的方法，wx.request请求add方法，post用户name，pwd到后台并存入数据库
    + addUser:点击添加用户后通过将此pages的data里hiddenmodalput设置为true展示添加用户界面
    + cancel:点击取消时通过将此pages的data里的hiddenmodalput设置为false关闭添加用户界面
    + settingICCard主要绑定在用户管理界面，点击后跳转到用户管理界面


#### devices/manage
此界面主要进行用户管理
获取全部用户信息为[https://www.happydoudou.xyz/public/index.php/user/getAllUsers](https://www.happydoudou.xyz/public/index.php/user/getAllUsers)
修改密码请求地址[https://www.happydoudou.xyz/public/index.php/user/changePwd](https://www.happydoudou.xyz/public/index.php/user/changePwd)
删除用户请求地址[https://www.happydoudou.xyz/public/index.php/user/changePwd](https://www.happydoudou.xyz/public/index.php/user/changePwd)

* JS
    + onShow在小程序界面每次展示时调用，主要请求getAllUser，获取全部用户信息并展示在界面中
    + editUserInfo此方法主要获取小程序点击事件，通过小程序data-*绑定传递event到JS文件中,详见[https://developers.weixin.qq.com/miniprogram/dev/framework/view/component.html](https://developers.weixin.qq.com/miniprogram/dev/framework/view/component.html),具体绑定在wxml文件15行，获取当前点击的行和数据，同时将data中hiddenmodalput设置为false展示修改密码和删除界面
    + deleteUser，点击删除时调用的方法，wx.request请求del方法，post用户名数据，PHP文件根据用户名进行匹配，删除数据库中相关数据
    + changePwd,点击提交修改用户名时调用，post要修改的用户名和密码交给后台PHP处理，PHP根据用户名进行匹配，修改数据库中相关数据

#### history 
开关门锁历史记录显示方法，在每次onShow第一次展示时从getLock获取数据，将开关门锁的历史信息存入data中，并在wxml中通过**wx:for**遍历获取的用户数据，根据信息中的action进行开关门锁的判断，若action为0则为开锁，action为1则为关锁