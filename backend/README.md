### 建chat record表的sql语句：

```sql
CREATE TABLE `ac_database`.`chat_record_8` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `realname` CHAR NULL,
  `time` DATETIME NOT NULL,
  `message` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));
```

