DROP TABLE `dochadzka`.`absence_types`;
CREATE TABLE `dochadzka`.`absence_types` (
  `type_id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(45) NULL,
  `name` VARCHAR(45) NULL,
  `confirmed` INT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `string_UNIQUE` (`key` ASC) VISIBLE)
DEFAULT CHARACTER SET = utf8;

INSERT INTO `absence_types` VALUES 
(1,'ABSENCE_ILL','Práceneschopnosť',1),
(2,'ABSENCE_TRAVEL','Pracovná cesta',0),
(3,'ABSENCE_HOLIDAY','Dovolenka',1),
(4,'ABSENCE_WORKFROMHOME','Práca doma',0),
(5,'ABSENCE_OTHER','Iná neprítomnosť',1),
(6,'ABSENCE_MATERNAL','Materská dovolenka',1),
(7,'ABSENCE_PARENTAL','Rodičovská dovolenka',1);

ALTER TABLE `dochadzka`.`absence` 
ADD CONSTRAINT `absence_types`
  FOREIGN KEY (`type`)
  REFERENCES `dochadzka`.`absence_types` (`type_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

DROP TABLE `dochadzka`.`perms`;
CREATE TABLE `dochadzka`.`perms` (
  `role` INT NOT NULL,
  `perm` VARCHAR(45) NOT NULL,
   CONSTRAINT perm_key CHECK (perm IN ('user_managment', 'bypass_time', 'edit_budgets', 'edit_deadlines', 'edit_holidays', 'impersonate', 'manage_requests', 'export'))
 );
  
ALTER TABLE `dochadzka`.`perms` 
ADD UNIQUE INDEX `unique_row` (`role` ASC, `key` ASC);


INSERT INTO `dochadzka`.`perms`
(`role`,
`perm`)
VALUES
(2, "user_managment"),
(3, "bypass_time"),
(3, "edit_budgets"),
(3, "edit_deadlines"),
(3, "edit_holidays"),
(3, "export"),
(3, "impersonate"),
(3, "user_managment"),
(4, "manage_requests")




CREATE TABLE `dochadzka`.`tickets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `from_date` DATETIME NOT NULL,
  `to_date` DATETIME NOT NULL,
  `last_printed` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `TICKET_USER` (`user_id` ASC, `from_date` ASC) INVISIBLE,
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `dochadzka`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
	
ALTER TABLE `dochadzka`.`tickets` 
CHANGE COLUMN `last_printed` `last_printed` DATETIME NULL DEFAULT NOW() ;

ALTER TABLE `dochadzka`.`tickets` 
CHANGE COLUMN `from_date` `from_date` DATE NOT NULL ,
CHANGE COLUMN `to_date` `to_date` DATE NOT NULL ;

ALTER TABLE `dochadzka`.`absence_types` 
CHANGE COLUMN `confirmed` `default_confirmation` INT NULL DEFAULT '1' ;
