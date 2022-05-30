-- MySQL dump 10.19  Distrib 10.3.34-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: nodejs-news-app
-- ------------------------------------------------------
-- Server version	10.3.34-MariaDB-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_email_verification`
--

DROP TABLE IF EXISTS `tb_email_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_email_verification` (
  `verification_id` int(11) NOT NULL AUTO_INCREMENT,
  `verification_email` varchar(255) NOT NULL,
  `verification_expires` datetime NOT NULL DEFAULT (current_timestamp() + interval 1 hour),
  `verification_user` int(11) NOT NULL,
  `verification_token` char(128) NOT NULL,
  PRIMARY KEY (`verification_id`),
  KEY `fk_user_id` (`verification_user`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`verification_user`) REFERENCES `tb_users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_email_verification`
--

LOCK TABLES `tb_email_verification` WRITE;
/*!40000 ALTER TABLE `tb_email_verification` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_email_verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_news`
--

DROP TABLE IF EXISTS `tb_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_news` (
  `news_id` int(11) NOT NULL AUTO_INCREMENT,
  `news_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `news_desc` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `news_content` text COLLATE utf8_unicode_ci NOT NULL,
  `news_author` int(11) NOT NULL,
  `news_date` datetime NOT NULL DEFAULT utc_timestamp(),
  `news_slug` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `news_datestr` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT utc_timestamp(),
  PRIMARY KEY (`news_id`),
  UNIQUE KEY `news_slug` (`news_slug`),
  KEY `news_author` (`news_author`),
  CONSTRAINT `tb_news_ibfk_1` FOREIGN KEY (`news_author`) REFERENCES `tb_users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_news`
--

LOCK TABLES `tb_news` WRITE;
/*!40000 ALTER TABLE `tb_news` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_news_comments`
--

DROP TABLE IF EXISTS `tb_news_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_news_comments` (
  `comments_id` int(11) NOT NULL AUTO_INCREMENT,
  `comments_content` varchar(3000) NOT NULL,
  `comments_date` datetime NOT NULL DEFAULT utc_timestamp(),
  `comments_dateStr` varchar(255) NOT NULL DEFAULT utc_timestamp(),
  `comments_author` int(11) DEFAULT NULL,
  `news_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`comments_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_news_comments`
--

LOCK TABLES `tb_news_comments` WRITE;
/*!40000 ALTER TABLE `tb_news_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_news_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_user_sessions`
--

DROP TABLE IF EXISTS `tb_user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_user_sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_user_sessions`
--

LOCK TABLES `tb_user_sessions` WRITE;
/*!40000 ALTER TABLE `tb_user_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_users`
--

DROP TABLE IF EXISTS `tb_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_slug` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_biography` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_joinedAt` datetime NOT NULL DEFAULT utc_timestamp(),
  `user_joinedAtStr` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT utc_timestamp(),
  `email_verificated` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`),
  UNIQUE KEY `user_slug` (`user_slug`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_users`
--

LOCK TABLES `tb_users` WRITE;
/*!40000 ALTER TABLE `tb_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-29 22:23:36
