# ************************************************************
# Sequel Pro SQL dump
# Version 5446
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 47.115.48.3 (MySQL 5.7.31-0ubuntu0.18.04.1)
# Database: feedpig_mw
# Generation Time: 2021-03-16 09:39:01 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table admin
# ------------------------------------------------------------

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `permission` enum('super','normal','read_only') DEFAULT NULL COMMENT '权限',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='管理后台身份系统';



# Dump of table compay_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `compay_log`;

CREATE TABLE `compay_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT '0' COMMENT '转账到此用户id',
  `relate_user_id` int(11) DEFAULT '0' COMMENT '关联的用户id',
  `amount` int(11) DEFAULT '0' COMMENT '金额',
  `partner_trade_no` varchar(32) DEFAULT '' COMMENT '商户订单号	',
  `payment_no` varchar(64) DEFAULT '' COMMENT '微信付款单号	',
  `return_code` varchar(16) DEFAULT '' COMMENT '企业支付到零钱接口返回的result_code',
  `result_code` varchar(16) DEFAULT '' COMMENT '企业支付到零钱接口返回的result_code',
  `return_data` varchar(512) DEFAULT '' COMMENT '企业支付到零钱接口返回信息，不包括敏感信息',
  `repay_status` tinyint(1) DEFAULT '0' COMMENT '支付失败时重发状态，0为未重发成功，1为重发成功',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业转账到用户零钱日志表';



# Dump of table im_pigs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `im_pigs`;

CREATE TABLE `im_pigs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `shelf_id` int(11) DEFAULT NULL COMMENT '货架商品id',
  `group_id` varchar(32) DEFAULT NULL COMMENT '群聊群组id',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `shelf_id` (`shelf_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='群组聊天商品';



# Dump of table invite
# ------------------------------------------------------------

DROP TABLE IF EXISTS `invite`;

CREATE TABLE `invite` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `share_user_id` int(11) DEFAULT NULL COMMENT '发起邀请的用户id',
  `be_invited_user_id` int(11) DEFAULT NULL COMMENT '被邀请的用户id',
  `invite_status` int(11) DEFAULT '0' COMMENT '分享状态：0已邀请 1 待返现 2 已返现',
  `money` int(11) DEFAULT '0' COMMENT '可以获得的奖励',
  `cash_back_time` varchar(64) DEFAULT NULL COMMENT '返现时间：将在这个时间进行返现',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邀请关联表';



# Dump of table orders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `pig_id` int(11) DEFAULT NULL COMMENT '猪的id',
  `type_no` tinyint(1) DEFAULT '1',
  `animal_name` varchar(32) DEFAULT '' COMMENT '所下单的动物的名称，如果是vip订单则为空',
  `order_sn` varchar(20) DEFAULT '' COMMENT '订单号',
  `out_trade_no` varchar(32) DEFAULT '' COMMENT '支付单号',
  `total_price` bigint(11) DEFAULT '0' COMMENT '总价',
  `order_status` tinyint(1) DEFAULT '0' COMMENT '订单状态 0 未完成 1 已支付 2 已取消 3 申请退款4 已退款 5 已过期',
  `extra_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_sn_idx` (`order_sn`),
  KEY `user_idx` (`user_id`),
  KEY `out_trade_no_idx` (`out_trade_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';



# Dump of table pay_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `pay_log`;

CREATE TABLE `pay_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL COMMENT '订单id',
  `out_trade_no` varchar(20) DEFAULT NULL COMMENT '支付订单号',
  `unifiedorder_result` varchar(512) DEFAULT NULL COMMENT '调用结果',
  `notify_result` varchar(512) DEFAULT NULL COMMENT '返回结果',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id_idx` (`order_id`),
  KEY `out_trade_no_idx` (`out_trade_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付记录';



# Dump of table pigs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `pigs`;

CREATE TABLE `pigs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ear_ring_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '' COMMENT '耳标号',
  `batch_no` varchar(32) DEFAULT '' COMMENT '批次编号',
  `birthday` varchar(64) DEFAULT '' COMMENT '生日信息',
  `weight` varchar(16) DEFAULT '' COMMENT '体重',
  `status` tinyint(1) DEFAULT '0' COMMENT '猪的状态信息：0 未卖出，1 已卖出，2 已回购，3 已屠宰，4 已死亡',
  `extra_data` json DEFAULT NULL COMMENT '额外信息',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='猪的源信息（sku表的猪类型的库存），包含猪的体重，生日等，是否卖出等，每天都会请求一遍青莲测的接口更新一遍状态';



# Dump of table shelf
# ------------------------------------------------------------

DROP TABLE IF EXISTS `shelf`;

CREATE TABLE `shelf` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_pigs_id` int(11) unsigned NOT NULL COMMENT 'user_pigs表对应猪id',
  `buy_user_id` int(11) DEFAULT NULL COMMENT '购买猪的用户id',
  `price` int(11) DEFAULT '0' COMMENT '上架定价',
  `status` tinyint(4) DEFAULT '0' COMMENT '上架情况：0 未卖出，1 已卖出待结算，2 已结算',
  `buy_time` varchar(64) DEFAULT NULL COMMENT '该上架的猪被购买时间',
  `cash_back_time` varchar(64) DEFAULT NULL COMMENT '结算返现时间',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户上架商品猪';



# Dump of table sku
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sku`;

CREATE TABLE `sku` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `spu_id` int(11) DEFAULT NULL COMMENT 'spu表id',
  `batch_no` varchar(32) DEFAULT '' COMMENT '批次号',
  `price` int(11) DEFAULT '0' COMMENT '库存商品价格',
  `sells` int(11) DEFAULT '0' COMMENT '卖出数量',
  `rest` int(11) DEFAULT '1' COMMENT '剩余数量',
  `extra_data` json DEFAULT NULL COMMENT '额外信息',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='SKU（Stock Keeping Unit）即库存量单位    SKU即库存进出计量的单位，可以是以件、盒、托盘等为单位。';



# Dump of table spu
# ------------------------------------------------------------

DROP TABLE IF EXISTS `spu`;

CREATE TABLE `spu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT '' COMMENT '名称',
  `type_no` tinyint(2) DEFAULT '0' COMMENT '类型号：0  猪',
  `extra_data` json DEFAULT NULL COMMENT '额外信息',
  `priority` tinyint(1) DEFAULT '0' COMMENT '显示在用户选择位置的优先级，越大优先级越高',
  `on_sell` tinyint(1) DEFAULT '1' COMMENT '是否上架',
  `can_admin` tinyint(4) DEFAULT '0' COMMENT '是否能在管理后台编辑',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='SPU（Standard Product Unit）即标准化产品单元    SPU是商品信息聚合的最小单位，是一组可复用标准化信息的集合。';



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) COLLATE utf8mb4_bin DEFAULT '' COMMENT '用户手机号',
  `openid` varchar(255) COLLATE utf8mb4_bin DEFAULT '' COMMENT '用户openid',
  `unionid` varchar(32) COLLATE utf8mb4_bin DEFAULT '' COMMENT '用户unionid',
  `is_vip` tinyint(1) DEFAULT '0' COMMENT '是否是会员',
  `nickname` varchar(20) COLLATE utf8mb4_bin DEFAULT '' COMMENT '用户昵称',
  `avatar_url` varchar(255) COLLATE utf8mb4_bin DEFAULT '' COMMENT '用户头像',
  `location` varchar(128) COLLATE utf8mb4_bin DEFAULT '' COMMENT '用户定位信息',
  `country` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '国家',
  `province` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '省份',
  `city` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '城市',
  `gender` tinyint(1) DEFAULT '0' COMMENT '性别：0为女，1为男',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户表';



# Dump of table user_pigs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_pigs`;

CREATE TABLE `user_pigs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `pig_id` int(11) DEFAULT NULL COMMENT '猪的源信息id',
  `pig_nickname` varchar(64) DEFAULT '' COMMENT '猪的昵称',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态：0正常 1 已卖出 2 已退款3 异常',
  `solve_type` tinyint(1) DEFAULT '0' COMMENT '处理类型：0 平台回购，1 卖给用户，2 自己吃赠送',
  `solve_status` tinyint(1) DEFAULT '0' COMMENT '处理状态：0 未处理，1 进行中，2 已完成',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户猪关联表';




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
