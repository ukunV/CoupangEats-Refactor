## Architecture

![sdaf](https://user-images.githubusercontent.com/23329560/128726338-7fdd528f-553d-464e-8024-61a28c893587.JPG)

## Structure

```
├── 📂 config
│   ├── 📄 baseResponseStatus.ts
│   ├── 📄 database.ts
│   ├── 📄 express.ts
│   ├── 📄 jwtMiddleware.ts
│   ├── 📄 kakao_config.ts
│   ├── 📄 mail_config.ts
│   ├── 📄 response.ts
│   ├── 📄 secret.ts
│   ├── 📄 sens_config.ts
│   └── 📄 winston.ts
├── 📂 controllers
│   ├── 📄 kakao_ctrl.ts
│   ├── 📄 mail_ctrl.ts
│   ├── 📄 sens_ctrl.ts
│   └── 📄 user_ctrl.ts
├── 📂 log
├── 📂 node_modules
├── 📂 src
│   └── 📂 app
│      │
│      ├── 📄 index.d.ts
│      │
│      ├── 📂 Address
│      │    ├── 📄 addressDao.ts
│      │    ├── 📄 addressController.ts
│      │    ├── 📄 addressProvider.ts
│      │    └── 📄 addressService.ts
│      ├── 📂 admin
│      │    ├── 📄 adminDao.ts
│      │    ├── 📄 adminController.ts
│      │    ├── 📄 adminProvider.ts
│      │    └── 📄 adminService.ts
│      ├── 📂 Cart
│      │    ├── 📄 cartDao.ts
│      │    ├── 📄 cartController.ts
│      │    ├── 📄 cartProvider.ts
│      │    └── 📄 cartService.ts
│      ├── 📂 Coupon
│      │    ├── 📄 couponDao.ts
│      │    ├── 📄 couponController.ts
│      │    ├── 📄 couponProvider.ts
│      │    └── 📄 couponService.ts
│      ├── 📂 Order
│      │    ├── 📄 orderDao.ts
│      │    ├── 📄 orderController.ts
│      │    ├── 📄 orderProvider.ts
│      │    └── 📄 orderService.ts
│      ├── 📂 Payment
│      │    ├── 📄 paymentDao.ts
│      │    ├── 📄 paymentController.ts
│      │    ├── 📄 paymentProvider.ts
│      │    └── 📄 paymentService.ts
│      ├── 📂 Review
│      │    ├── 📄 reviewDao.ts
│      │    ├── 📄 reviewController.ts
│      │    ├── 📄 reviewProvider.ts
│      │    └── 📄 reviewService.ts
│      ├── 📂 Store
│      │    ├── 📄 storeDao.ts
│      │    ├── 📄 storeController.ts
│      │    ├── 📄 storeProvider.ts
│      │    └── 📄 storeService.ts
│      └── 📂 User
│           ├── 📄 userDao.ts
│           ├── 📄 userController.ts
│           ├── 📄 userProvider.ts
│           └── 📄 userService.ts
│
├── 📄 .gitattributes
├── 📄 .gitignore
├── 📄 index.ts
├── 📄 package.tson
└── 📄 README.md
```

## ERD (AqueryTool)

[CoupangEats - ERD](https://aquerytool.com/aquerymain/index/?rurl=82cce02b-e18d-49ae-ad18-abff3b834202)

> password: g5wku1

## API Specification

[CoupangEats - API Specification](https://docs.google.com/spreadsheets/d/1JXW7_XLrDfxpg-_0Ct_up5ghHLRxxosVVmwFoRYQKB8/edit?usp=sharing)
