DROP TABLE IF EXISTS `absence_types`;
CREATE TABLE `absence_types` (
  `type_id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(45) NULL,
  `name` VARCHAR(45) NULL,
  `default_confirmation` INT NULL DEFAULT 1,
  PRIMARY KEY (`type_id`),
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

ALTER TABLE `absence` 
ADD CONSTRAINT `absence_types`
  FOREIGN KEY (`type`)
  REFERENCES `absence_types` (`type_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

DROP TABLE IF EXISTS `perms`;
CREATE TABLE `perms` (
  `role` INT NOT NULL,
  `perm` VARCHAR(45) NOT NULL,
   CONSTRAINT perm_key CHECK (perm IN ('user_managment', 'bypass_time', 'edit_budgets', 'edit_deadlines', 'edit_holidays', 'impersonate', 'manage_requests', 'export'))
 );
  
ALTER TABLE `perms` 
ADD UNIQUE INDEX `unique_row` (`role` ASC, `perm` ASC);


INSERT INTO `perms`
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
(4, "manage_requests");

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `from_date` DATE NOT NULL,
  `to_date` DATE NOT NULL,
  `last_printed` DATETIME NULL DEFAULT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `TICKET_USER` (`user_id` ASC, `from_date` ASC) INVISIBLE,
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
	

