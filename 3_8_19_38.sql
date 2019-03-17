-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.24-log - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for express-cc
DROP DATABASE IF EXISTS `express-cc`;
CREATE DATABASE IF NOT EXISTS `express-cc` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `express-cc`;

-- Dumping structure for table express-cc.accounts
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_source` enum('Web','Lead Converted','Phone Inquiry','Partner Referral','Purchased List','Other') NOT NULL DEFAULT 'Lead Converted',
  `lastName` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `annualRevenue` bigint(20) DEFAULT NULL,
  `created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_By` int(11) NOT NULL,
  `lastModified_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastModified_By` int(11) DEFAULT NULL,
  `billingAddress` varchar(200) DEFAULT NULL,
  `industry` varchar(50) DEFAULT NULL,
  `type` enum('Prospect','Customer - Direct','Customer - Channel','Channel Partner / Reseller','Installation Partner','Technology Partner','Other') DEFAULT 'Prospect',
  `rating` enum('Hot','Warm','Cold','None') DEFAULT 'Hot',
  `organisationId` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.accounts: ~2 rows (approximately)
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` (`id`, `account_source`, `lastName`, `firstName`, `annualRevenue`, `created_Date`, `created_By`, `lastModified_Date`, `lastModified_By`, `billingAddress`, `industry`, `type`, `rating`, `organisationId`) VALUES
	(1, 'Lead Converted', 'Nimmala', 'Lohith', 100000, '2019-03-08 18:39:14', 2, '2019-03-08 18:39:14', NULL, 'H.no 3-112 shanthinagar', 'IT industry', 'Customer - Direct', 'Hot', 'u000002'),
	(2, 'Web', 'GVSU', 'Michigan', 200000, '2019-03-08 18:40:55', 2, '2019-03-08 18:40:55', NULL, 'Grand Rapids Downtown', 'Education', 'Customer - Direct', 'Warm', 'u000002'),
	(3, 'Partner Referral', 'Kumar', 'Arun', 210000, '2019-03-08 18:44:26', 2, '2019-03-08 18:44:26', NULL, 'San Jose Downtown', 'Healthcare', 'Technology Partner', 'Cold', 'u000002');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;

-- Dumping structure for table express-cc.aptestingu000002
DROP TABLE IF EXISTS `aptestingu000002`;
CREATE TABLE IF NOT EXISTS `aptestingu000002` (
  `id` int(11) NOT NULL,
  `created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_By` varchar(30) DEFAULT NULL,
  `lastModified_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastModified_By` varchar(30) DEFAULT NULL,
  `organisationId` varchar(30) NOT NULL,
  `dsfd` longtext,
  `rc21` varchar(500) DEFAULT NULL,
  `q` bigint(20) DEFAULT NULL,
  `e` varchar(500) DEFAULT NULL,
  `t` text,
  `y` longtext,
  `a` date DEFAULT NULL,
  `s` datetime DEFAULT CURRENT_TIMESTAMP,
  `d` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.aptestingu000002: ~0 rows (approximately)
/*!40000 ALTER TABLE `aptestingu000002` DISABLE KEYS */;
/*!40000 ALTER TABLE `aptestingu000002` ENABLE KEYS */;

-- Dumping structure for table express-cc.campaigns
DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE IF NOT EXISTS `campaigns` (
  `campaign_id` int(11) NOT NULL AUTO_INCREMENT,
  `	isActive` enum('Y','N') NOT NULL DEFAULT 'Y',
  `name` varchar(100) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `actualCost` bigint(20) NOT NULL,
  `budgetedCost` bigint(20) NOT NULL,
  `description` varchar(300) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nNumberOfLeads` bigint(20) NOT NULL,
  `type` enum('Conference','Webinar','Trade Show','Partners','Public Relations','Referral Program','Banner Ads','Direct Mail','Email','Telemarketing','Social Media Marketing','Other') NOT NULL DEFAULT 'Conference',
  `status` enum('Planned','InProgress','Completed','Aborted') NOT NULL DEFAULT 'Planned',
  `created_By` int(11) NOT NULL,
  `organisationId` varchar(50) NOT NULL,
  `lastModified_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastModified_By` int(11) NOT NULL,
  PRIMARY KEY (`campaign_id`),
  UNIQUE KEY `Index 2` (`startDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.campaigns: ~0 rows (approximately)
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;

-- Dumping structure for table express-cc.leads
DROP TABLE IF EXISTS `leads`;
CREATE TABLE IF NOT EXISTS `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company` varchar(100) DEFAULT NULL,
  `created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_By` int(11) NOT NULL,
  `lastModified_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastModified_By` int(11) NOT NULL,
  `address` varchar(250) NOT NULL,
  `annual_Revenue` int(11) NOT NULL,
  `campaign_Id` int(11) NOT NULL,
  `donotcall` enum('Y','N') NOT NULL DEFAULT 'N',
  `fax` bigint(20) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `mobile` bigint(20) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `organisationId` varchar(50) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.leads: ~0 rows (approximately)
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;

-- Dumping structure for table express-cc.objects
DROP TABLE IF EXISTS `objects`;
CREATE TABLE IF NOT EXISTS `objects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `table_name` varchar(30) NOT NULL,
  `created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_By` varchar(30) DEFAULT NULL,
  `lastModified_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `type` enum('Standard','Custom') NOT NULL DEFAULT 'Custom',
  `lastModified_By` varchar(30) DEFAULT NULL,
  `organisationId` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `table_name` (`table_name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.objects: ~6 rows (approximately)
/*!40000 ALTER TABLE `objects` DISABLE KEYS */;
INSERT INTO `objects` (`id`, `name`, `table_name`, `created_Date`, `created_By`, `lastModified_Date`, `type`, `lastModified_By`, `organisationId`) VALUES
	(5, 'Accounts', 'Accounts', '2019-03-02 12:49:00', '', '2019-03-02 20:15:00', 'Standard', '', ''),
	(7, 'Leads', 'Leads', '2019-03-02 12:49:00', '', '2019-03-02 20:15:03', 'Standard', '', ''),
	(9, 'Aptesting', 'Aptestingu000002', '2019-03-05 17:16:39', '2', '2019-03-05 17:16:39', 'Custom', NULL, 'u000002'),
	(13, 'Campaigns', 'Campaigns', '2019-03-06 19:28:55', NULL, '2019-03-06 19:28:55', 'Standard', NULL, NULL),
	(14, 'Campaigns1', 'Campaigns1', '2019-03-06 19:28:55', NULL, '2019-03-07 22:47:19', 'Custom', NULL, 'u000003');
/*!40000 ALTER TABLE `objects` ENABLE KEYS */;

-- Dumping structure for table express-cc.objects_fields
DROP TABLE IF EXISTS `objects_fields`;
CREATE TABLE IF NOT EXISTS `objects_fields` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `field_name` varchar(30) NOT NULL,
  `type` enum('Standard','Custom') NOT NULL DEFAULT 'Custom',
  `field_type` varchar(100) DEFAULT NULL,
  `created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_By` varchar(30) DEFAULT NULL,
  `lastModified_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastModified_By` varchar(30) DEFAULT NULL,
  `organisationId` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `object_id_field_name` (`object_id`,`field_name`),
  UNIQUE KEY `object_id_name` (`id`,`name`),
  KEY `FK_object_fields_objects` (`object_id`),
  CONSTRAINT `FK_object_fields_objects` FOREIGN KEY (`object_id`) REFERENCES `objects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=293 DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.objects_fields: ~61 rows (approximately)
/*!40000 ALTER TABLE `objects_fields` DISABLE KEYS */;
INSERT INTO `objects_fields` (`id`, `object_id`, `name`, `field_name`, `type`, `field_type`, `created_Date`, `created_By`, `lastModified_Date`, `lastModified_By`, `organisationId`) VALUES
	(183, 5, 'id', 'id', 'Standard', 'int', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(184, 5, 'account_source', 'account_source', 'Standard', 'enum', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(185, 5, 'lastName', 'lastName', 'Standard', 'varchar', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(186, 5, 'firstName', 'firstName', 'Standard', 'varchar', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(187, 5, 'annualRevenue', 'annualRevenue', 'Standard', 'bigint', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(188, 5, 'created_Date', 'created_Date', 'Standard', 'timestamp', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(189, 5, 'created_By', 'created_By', 'Standard', 'int', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(190, 5, 'lastModified_Date', 'lastModified_Date', 'Standard', 'timestamp', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(191, 5, 'lastModified_By', 'lastModified_By', 'Standard', 'int', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(192, 5, 'billingAddress', 'billingAddress', 'Standard', 'varchar', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(193, 5, 'industry', 'industry', 'Standard', 'varchar', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(194, 5, 'type', 'type', 'Standard', 'enum', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(195, 5, 'rating', 'rating', 'Standard', 'enum', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(196, 5, 'organisationId', 'organisationId', 'Standard', 'varchar', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(197, 5, 'USER', 'USER', 'Standard', 'char', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(198, 5, 'HOST', 'HOST', 'Standard', 'char', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(199, 5, 'CURRENT_CONNECTIONS', 'CURRENT_CONNECTIONS', 'Standard', 'bigint', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(200, 5, 'TOTAL_CONNECTIONS', 'TOTAL_CONNECTIONS', 'Standard', 'bigint', '2019-03-06 20:03:37', NULL, '2019-03-06 20:03:37', NULL, NULL),
	(214, 7, 'id', 'id', 'Standard', 'int', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(215, 7, 'company', 'company', 'Standard', 'varchar', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(216, 7, 'created_Date', 'created_Date', 'Standard', 'timestamp', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(217, 7, 'created_By', 'created_By', 'Standard', 'int', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(218, 7, 'lastModified_Date', 'lastModified_Date', 'Standard', 'timestamp', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(219, 7, 'lastModified_By', 'lastModified_By', 'Standard', 'int', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(220, 7, 'address', 'address', 'Standard', 'varchar', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(221, 7, 'annual_Revenue', 'annual_Revenue', 'Standard', 'int', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(222, 7, 'campaign_Id', 'campaign_Id', 'Standard', 'int', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(223, 7, 'donotcall', 'donotcall', 'Standard', 'enum', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(224, 7, 'fax', 'fax', 'Standard', 'bigint', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(225, 7, 'description', 'description', 'Standard', 'varchar', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(226, 7, 'mobile', 'mobile', 'Standard', 'bigint', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(227, 7, 'firstName', 'firstName', 'Standard', 'varchar', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(228, 7, 'lastName', 'lastName', 'Standard', 'varchar', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(229, 7, 'organisationId', 'organisationId', 'Standard', 'varchar', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(230, 7, 'name', 'name', 'Standard', 'varchar', '2019-03-06 20:05:16', NULL, '2019-03-06 20:05:16', NULL, NULL),
	(245, 13, 'campaign_id', 'campaign_id', 'Standard', 'int', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(246, 13, '	isActive', '	isActive', 'Standard', 'enum', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(247, 13, 'name', 'name', 'Standard', 'varchar', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(248, 13, 'owner', 'owner', 'Standard', 'varchar', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(249, 13, 'actualCost', 'actualCost', 'Standard', 'bigint', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(250, 13, 'budgetedCost', 'budgetedCost', 'Standard', 'bigint', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(251, 13, 'description', 'description', 'Standard', 'varchar', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(252, 13, 'startDate', 'startDate', 'Standard', 'date', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(253, 13, 'endDate', 'endDate', 'Standard', 'date', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(254, 13, 'created_Date', 'created_Date', 'Standard', 'timestamp', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(255, 13, 'nNumberOfLeads', 'nNumberOfLeads', 'Standard', 'bigint', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(256, 13, 'type', 'type', 'Standard', 'enum', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(257, 13, 'status', 'status', 'Standard', 'enum', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(258, 13, 'created_By', 'created_By', 'Standard', 'int', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(259, 13, 'organisationId', 'organisationId', 'Standard', 'varchar', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(260, 13, 'lastModified_Date', 'lastModified_Date', 'Standard', 'timestamp', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(261, 13, 'lastModified_By', 'lastModified_By', 'Standard', 'int', '2019-03-06 20:05:42', NULL, '2019-03-06 20:05:42', NULL, NULL),
	(276, 9, 'rc21', 'rc21', 'Custom', 'VARCHAR(500)', '2019-03-06 20:09:09', '2', '2019-03-06 20:09:09', NULL, 'u000002'),
	(285, 9, 'w', 'w', 'Custom', 'DOUBLE', '2019-03-06 20:11:50', '2', '2019-03-06 20:11:50', NULL, 'u000002'),
	(286, 9, 'q', 'q', 'Custom', 'BIGINT', '2019-03-06 20:12:45', '2', '2019-03-06 20:12:45', NULL, 'u000002'),
	(287, 9, 'e', 'e', 'Custom', 'VARCHAR(500)', '2019-03-06 20:12:45', '2', '2019-03-06 20:12:45', NULL, 'u000002'),
	(288, 9, 't', 't', 'Custom', 'TEXT', '2019-03-06 20:12:45', '2', '2019-03-06 20:12:45', NULL, 'u000002'),
	(289, 9, 'y', 'y', 'Custom', 'LONGTEXT', '2019-03-06 20:12:45', '2', '2019-03-06 20:12:45', NULL, 'u000002'),
	(290, 9, 'a', 'a', 'Custom', 'DATE', '2019-03-06 20:12:45', '2', '2019-03-06 20:12:45', NULL, 'u000002'),
	(291, 9, 's', 's', 'Custom', 'DATETIME', '2019-03-06 20:12:45', '2', '2019-03-06 20:12:45', NULL, 'u000002'),
	(292, 9, 'd', 'd', 'Custom', 'DATETIMESTAMP', '2019-03-06 20:12:45', '2', '2019-03-06 20:12:45', NULL, 'u000002');
/*!40000 ALTER TABLE `objects_fields` ENABLE KEYS */;

-- Dumping structure for table express-cc.profiles
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('Custom','Standard') NOT NULL DEFAULT 'Custom',
  `name` varchar(30) NOT NULL,
  `created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_By` varchar(30) DEFAULT NULL,
  `lastModified_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `organisationId` varchar(50) DEFAULT NULL,
  `lastModified_By` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Index 2` (`name`,`organisationId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.profiles: ~6 rows (approximately)
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` (`id`, `type`, `name`, `created_Date`, `created_By`, `lastModified_Date`, `organisationId`, `lastModified_By`) VALUES
	(3, 'Custom', 'CustomP111', '2019-03-01 23:21:26', '2', '2019-03-02 11:31:03', 'u000002', '12'),
	(5, 'Custom', 'CustomP2', '2019-03-01 23:23:03', '2', '2019-03-01 23:23:03', 'u000002', NULL),
	(6, 'Custom', 'Custom3', '2019-03-01 23:23:17', '2', '2019-03-01 23:23:17', 'u000002', NULL),
	(14, 'Standard', 'Customer_Care_Specialist', '2019-03-01 23:47:38', '2', '2019-03-01 23:48:25', '', NULL),
	(15, 'Standard', 'Customer_Care_Supervisor', '2019-03-01 23:47:43', '2', '2019-03-01 23:48:27', '', NULL),
	(16, 'Custom', 'CustomP121', '2019-03-02 11:30:55', '12', '2019-03-02 11:30:55', 'u000002', NULL);
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;

-- Dumping structure for table express-cc.profile_mgts
DROP TABLE IF EXISTS `profile_mgts`;
CREATE TABLE IF NOT EXISTS `profile_mgts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_id` int(11) NOT NULL,
  `object_id` int(11) NOT NULL,
  `object_field_id` int(11) NOT NULL,
  `access_type` enum('write','read','hidden') NOT NULL DEFAULT 'write',
  `created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_By` varchar(30) DEFAULT NULL,
  `organisationId` varchar(30) NOT NULL,
  `lastModified_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastModified_By` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `profile_id_object_id_field_name` (`object_id`,`object_field_id`,`profile_id`),
  KEY `FK_profile_mgmts_object_fields` (`object_field_id`),
  KEY `FK_profile_mgmts_profiles` (`profile_id`),
  CONSTRAINT `FK_profile_mgmts_object_fields` FOREIGN KEY (`object_field_id`) REFERENCES `objects_fields` (`id`),
  CONSTRAINT `FK_profile_mgmts_objects` FOREIGN KEY (`object_id`) REFERENCES `objects` (`id`),
  CONSTRAINT `FK_profile_mgmts_profiles` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.profile_mgts: ~0 rows (approximately)
/*!40000 ALTER TABLE `profile_mgts` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_mgts` ENABLE KEYS */;

-- Dumping structure for table express-cc.sessions
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.sessions: ~2 rows (approximately)
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
	('C9SXoVaZ5mXAE1gC9MCWLjHN1jnhAhIf', 1552176711, '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":{"user_id":2,"organisation_Id":"u000002","standard_menu":["Accounts","Leads","More1","More1","More1","More1"],"custom_menu":["Aptesting","Lore1","Lore1","Lore1","Lore1"]}}}'),
	('FrStdSmVyWv318Ghygs4-oFKNZoZgtxA', 1552178142, '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":{"user_id":2,"organisation_Id":"u000002","standard_menu":["Accounts","Leads","More1","More1","More1","More1","Accounts","Leads","More1","More1","More1","More1","Accounts","Leads","More1","More1","More1","More1","Accounts","Leads","More1","More1","More1","More1"],"custom_menu":["Aptesting","Lore1","Lore1","Lore1","Lore1","Aptesting","Lore1","Lore1","Lore1","Lore1","Aptesting","Lore1","Lore1","Lore1","Lore1","Aptesting","Lore1","Lore1","Lore1","Lore1"]}}}'),
	('qV03XkwqcQfXiNOL1lsvcStN3CB-e7j-', 1552111271, '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":{"user_id":2,"organisation_Id":"u000002"}}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;

-- Dumping structure for table express-cc.test1
DROP TABLE IF EXISTS `test1`;
CREATE TABLE IF NOT EXISTS `test1` (
  `id` int(11) NOT NULL,
  `created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_By` varchar(30) DEFAULT NULL,
  `lastModified_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastModified_By` varchar(30) DEFAULT NULL,
  `organisationId` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.test1: ~0 rows (approximately)
/*!40000 ALTER TABLE `test1` DISABLE KEYS */;
/*!40000 ALTER TABLE `test1` ENABLE KEYS */;

-- Dumping structure for table express-cc.test2
DROP TABLE IF EXISTS `test2`;
CREATE TABLE IF NOT EXISTS `test2` (
  `id` int(11) NOT NULL,
  `created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_By` varchar(30) DEFAULT NULL,
  `lastModified_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastModified_By` varchar(30) DEFAULT NULL,
  `organisationId` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.test2: ~0 rows (approximately)
/*!40000 ALTER TABLE `test2` DISABLE KEYS */;
/*!40000 ALTER TABLE `test2` ENABLE KEYS */;

-- Dumping structure for table express-cc.testing
DROP TABLE IF EXISTS `testing`;
CREATE TABLE IF NOT EXISTS `testing` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `c2` date DEFAULT NULL,
  `dd` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `varf` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.testing: ~2 rows (approximately)
/*!40000 ALTER TABLE `testing` DISABLE KEYS */;
INSERT INTO `testing` (`Id`, `c2`, `dd`, `varf`) VALUES
	(10, NULL, '2019-03-05 16:29:31', NULL),
	(11, NULL, '2019-03-05 16:29:31', NULL);
/*!40000 ALTER TABLE `testing` ENABLE KEYS */;

-- Dumping structure for procedure express-cc.Update_Organisation_Id
DROP PROCEDURE IF EXISTS `Update_Organisation_Id`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `Update_Organisation_Id`(
	IN `orgId` VARCHAR(50),
	IN `userid` INT
)
BEGIN
Update users set organisationid=orgId where id=userid;

END//
DELIMITER ;

-- Dumping structure for table express-cc.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` binary(60) NOT NULL,
  `registeredOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `organisationId` varchar(20) DEFAULT NULL,
  `created_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_By` varchar(30) DEFAULT NULL,
  `lastModified_Date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastModified_By` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`organisationId`,`username`),
  KEY `Index 2` (`organisationId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- Dumping data for table express-cc.users: ~15 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `email`, `password`, `registeredOn`, `organisationId`, `created_Date`, `created_By`, `lastModified_Date`, `lastModified_By`) VALUES
	(1, 'Shravya1213', 'Shravya121@gmail.com', _binary 0x2432612431302468373561766D596F4957394772706D51417A586E6B4F61495273746D4F452E765A6646353433476630574D6570582E4F50465A6C53, '2019-03-01 14:13:52', 'u000001', '2019-03-01 13:19:32', '1', '2019-03-01 14:13:52', '1'),
	(2, 'testing1', 'testing1@gmail.com', _binary 0x24326124313024715967704A374B3462456B6C76567455392F6D52376539622E5735464B576F4C4245344D4B70686451413152316A52697A31345557, '2019-03-01 21:56:47', 'u000002', '2019-03-01 13:19:32', '1', '2019-03-01 21:56:47', '13'),
	(3, 'CustomP11', 'lohith123@gmail.com', _binary 0x243261243130244D71424F4A674243445A422E4F38613469675637334F7758674E693846444B4C396955366A437379346E69714E634D474D6931574F, '2019-03-02 11:20:14', 'u000003', '2019-03-01 13:19:32', '2', '2019-03-02 11:20:14', '2'),
	(4, 'testing2edit', 'testing2@gmail.com', _binary 0x2432612431302434716332424C5A4A49723333462E6E31667A4149762E477631324331456162714D69324A3869446F4E763441324B2F5959534A7A4F, '2019-03-01 14:13:34', 'u000002', '2019-03-01 13:19:32', '2', '2019-03-01 14:13:34', '1'),
	(5, 'testing3edit', 'testing3@gmail.com', _binary 0x243261243130244F35657A792F3243412F354F44326277646D6C716B65356C6955684F66422E544D4F46356E69685948706C3473786D534870456A65, '2019-03-01 14:16:15', 'u000005', '2019-03-01 13:19:32', '5', '2019-03-01 14:16:15', '5'),
	(7, 'testing4', 'testing4@gmail.com', _binary 0x24326124313024716A78533573594431736F7337486D6276465176332E596370487657477A79686D3379723735314756587362346B6C345364705965, '2019-03-01 14:13:01', 'u000007', '2019-03-01 13:19:32', '5', '2019-03-01 14:13:01', '5'),
	(8, 'testing6', 'testing5@gmail.com', _binary 0x243261243130242F74625665596B2E724E5162556D3557724D6A384A2E7A44776A3277786C2F51414D674243774433546F4D484336436C566E635A47, '2019-03-01 14:13:02', 'u000009', '2019-03-01 13:19:32', '5', '2019-03-01 14:13:02', '5'),
	(10, 'ntesting1', 'ntesting1@gmail.com', _binary 0x2432612431302467796E7A7152576F2F79376A7649546A7A753557724F4D734F6370596F53584F55614962575565304638506D457A3444586B706B53, '2019-03-01 14:13:03', 'u000009', '2019-03-01 13:19:32', '5', '2019-03-01 14:13:03', '5'),
	(12, 'testing2', 'ntesting2@gmail.com', _binary 0x243261243130247277615064455A6679424C694F797138466E69703275457879544C6367454C64376C746F7862774D794D5A56484E38367777316869, '2019-03-02 11:22:45', 'u000002', '2019-03-01 13:19:32', '2', '2019-03-02 11:22:45', '1'),
	(13, 'ntesting3', 'ntesting3@gmail.com', _binary 0x243261243130244E532F5051585068457670674E5A4135455A6F64752E754D695553466262484979544230453579365A525356337658433870642F4B, '2019-03-01 14:16:08', 'u0000013', '2019-03-01 13:19:32', '2', '2019-03-01 14:16:08', ''),
	(14, 'ntesting4', 'ntesting4@gmail.com', _binary 0x243261243130244D4B4768677655596B7835592E464E305078706C704F6B4D4161784B4534625853624A77476E56426F31782F2E575668704B4B2F4F, '2019-03-01 14:13:36', 'u000002', '2019-03-01 13:19:32', '2', '2019-03-01 14:13:36', '1'),
	(15, 'n4testing1', 'n4testing1@gmail.com', _binary 0x243261243130244D7859317442336F69314F4266666A6D337774645565535A414659766A6B4273774C68794A796E676751525374533741454A4D4A32, '2019-03-01 14:13:36', 'u000002', '2019-03-01 13:19:32', '2', '2019-03-01 14:13:36', '1'),
	(16, 'n5testing1', 'n5testing1@gmail.com', _binary 0x2432612431302446465262484A6C33795A63355755663873354472492E3065664E776B68587A6832647357315158684738334C636E4554535A596132, '2019-03-01 14:13:42', 'u000002', '2019-03-01 13:19:32', '2', '2019-03-01 14:13:42', '4'),
	(18, 'testing11', 'nimmaladfsdfdl@mail.gvsu.edu', _binary 0x24326124313024645046766B2F4A3531384D6F4E56552F4B4B51646D65367168726E74434E6358706A7233676F2F6E2E4D494446564A4E5474775A32, '2019-03-02 14:57:00', 'u0000013', '2019-03-01 23:46:00', '13', '2019-03-02 14:57:00', NULL),
	(20, 'testprofile1', 'nimmalal1231@yahoo.com', _binary 0x2432612431302461677A4565333559686C4E51542F7A6A736F6B47794F4D684B314D736A356F587466455247564F3177705832596478724F67316371, '2019-03-02 11:34:51', 'u000002', '2019-03-02 11:34:38', '12', '2019-03-02 11:34:51', '12');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Dumping structure for trigger express-cc.name_concat
DROP TRIGGER IF EXISTS `name_concat`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `name_concat` BEFORE INSERT ON `leads` FOR EACH ROW SET new.name=CONCAT(firstName,' ', lastName)//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger express-cc.objects_fields_after_insert
DROP TRIGGER IF EXISTS `objects_fields_after_insert`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `objects_fields_after_insert` AFTER INSERT ON `objects_fields` FOR EACH ROW BEGIN

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger express-cc.objects_fields_before_insert
DROP TRIGGER IF EXISTS `objects_fields_before_insert`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `objects_fields_before_insert` BEFORE INSERT ON `objects_fields` FOR EACH ROW BEGIN
DECLARE P1,P2,P3 VARCHAR(50);
IF NEW.field_type<> NULL THEN

SELECT table_name INTO P1 FROM objects WHERE id=NEW.object_id;

SELECT COLUMN_TYPE into P3 FROM information_schema.COLUMNS 
  WHERE table_schema='express-cc' AND 
  table_name = P1 AND COLUMN_NAME = NEW.field_name;
  
SET NEW.field_type=P3;
END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger express-cc.users_insert_trigger
DROP TRIGGER IF EXISTS `users_insert_trigger`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `users_insert_trigger` BEFORE INSERT ON `users` FOR EACH ROW SET new.organisationId=CONCAT("u00000",(select MAX(id) from users)+1)//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
