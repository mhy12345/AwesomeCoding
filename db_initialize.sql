CREATE DATABASE IF NOT EXISTS `ac_database`;
USE `ac_database`;

CREATE TABLE IF NOT EXISTS `users`(
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`nickname` VARCHAR(40),
	`realname` VARCHAR(40),
	`role` INT UNSIGNED NOT NULL,
	`motto` VARCHAR(200),
	`registration_date` DATE,
	`password` CHAR(40) NOT NULL,
	PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
