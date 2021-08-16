var env = 'local';
var object  = {
  dboptions : {
    host: "192.168.1.200",
    user: "dev",
    password: "123456",
    database: "travveoo",
    charset : 'utf8mb4',
    connectionLimit: 10,
  },
  lang_id : '1',
  env : 'local',
  juniper_user: 'TestXMLServ5Group',
  juniper_pass: 'xhth94ML',
  juniper_lang: 'en',

  giata_user: 'developers|travveo.com',
  giata_pass: 'Travveo_Password',
  giata_lang: 'en',
}

if(env == 'test'){

  object['dboptions'] = {
    host: "localhost",
    user: "travveo_travveo",
    password: "Oc5Dwpw2t4s8kzEP",
    database: "travveo_travveo",
    charset : 'utf8mb4',
    connectionLimit: 10,
  };
  object['env']= 'test';
  object['juniper_user'] = "XMLWorldClassTravel";
  object['juniper_pass'] = "MOT1795tea";

}else if(env == 'live'){

  object['dboptions'] = {
    host: "localhost",
    user: "travveo_travveo",
    password: "Oc5Dwpw2t4s8kzEP",
    database: "travveo_livedemo",
    charset : 'utf8mb4',
    connectionLimit: 10,
  };
  object['env']= 'live';
  object['juniper_user'] = "XMLWorldClassTravel";
  object['juniper_pass'] = "MOT1795tea";
}

module.exports = Object.freeze(object);