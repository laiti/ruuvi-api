-- Create syntax for TABLE 'tag'
CREATE TABLE `tag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ruuvi_id` varchar(32) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create syntax for TABLE 'history'
CREATE TABLE `history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tag_id` int(11) unsigned DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `temperature` float DEFAULT NULL,
  `humidity` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ruuvi_id` (`tag_id`),
  CONSTRAINT `history_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create syntax for TABLE 'history_longterm'
CREATE TABLE `history_longterm` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tag_id` int(11) unsigned DEFAULT NULL,
  `date` date DEFAULT NULL,
  `temperature_min` float DEFAULT NULL,
  `temperature_max` float DEFAULT NULL,
  `temperature_day_average` float DEFAULT NULL,
  `humidity_min` float DEFAULT NULL,
  `humidity_max` float DEFAULT NULL,
  `humidity_night_average` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `history_longterm_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

