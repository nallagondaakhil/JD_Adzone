import { Injectable } from '@angular/core';

@Injectable()
export class MockDataService {
    constructor() {

    }

    getAllData(start: number, pageSize: number): Promise<{data: any[], totalRecords: number}> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                  data: dataList.slice(start, (start + pageSize)),
                  totalRecords: dataList.length
                });
            }, 200);
        });
    }
}
const dataList = [{
    id: 1,
    first_name: 'Erminie',
    last_name: 'Tynewell',
    email: 'etynewell0@shareasale.com'
  }, {
    id: 2,
    first_name: 'Tiena',
    last_name: 'Skally',
    email: 'tskally1@mail.ru'
  }, {
    id: 3,
    first_name: 'Micky',
    last_name: 'Scholcroft',
    email: 'mscholcroft2@imgur.com'
  }, {
    id: 4,
    first_name: 'Zebedee',
    last_name: 'Jori',
    email: 'zjori3@blogspot.com'
  }, {
    id: 5,
    first_name: 'Mariska',
    last_name: 'Praundlin',
    email: 'mpraundlin4@thetimes.co.uk'
  }, {
    id: 6,
    first_name: 'Virgil',
    last_name: 'Baumer',
    email: 'vbaumer5@theglobeandmail.com'
  }, {
    id: 7,
    first_name: 'Tine',
    last_name: 'Briffett',
    email: 'tbriffett6@tuttocitta.it'
  }, {
    id: 8,
    first_name: 'Anita',
    last_name: 'DEnrico',
    email: 'adenrico7@addtoany.com'
  }, {
    id: 9,
    first_name: 'Antonio',
    last_name: 'Faithorn',
    email: 'afaithorn8@indiatimes.com'
  }, {
    id: 10,
    first_name: 'Grace',
    last_name: 'Greggor',
    email: 'ggreggor9@hud.gov'
  }, {
    id: 11,
    first_name: 'Arni',
    last_name: 'Harradine',
    email: 'aharradinea@china.com.cn'
  }, {
    id: 12,
    first_name: 'Ryley',
    last_name: 'Curtin',
    email: 'rcurtinb@msn.com'
  }, {
    id: 13,
    first_name: 'Abbot',
    last_name: 'Orgel',
    email: 'aorgelc@posterous.com'
  }, {
    id: 14,
    first_name: 'Ev',
    last_name: 'Cash',
    email: 'ecashd@chron.com'
  }, {
    id: 15,
    first_name: 'Mariana',
    last_name: 'Erbe',
    email: 'merbee@amazon.com'
  }, {
    id: 16,
    first_name: 'Gerald',
    last_name: 'Matusevich',
    email: 'gmatusevichf@desdev.cn'
  }, {
    id: 17,
    first_name: 'Rosene',
    last_name: 'Melan',
    email: 'rmelang@chron.com'
  }, {
    id: 18,
    first_name: 'Alys',
    last_name: 'Noone',
    email: 'anooneh@de.vu'
  }, {
    id: 19,
    first_name: 'Deloria',
    last_name: 'Oliver-Paull',
    email: 'doliverpaulli@ovh.net'
  }, {
    id: 20,
    first_name: 'Neda',
    last_name: 'Drinkel',
    email: 'ndrinkelj@reddit.com'
  }, {
    id: 21,
    first_name: 'Chev',
    last_name: 'Millins',
    email: 'cmillinsk@slate.com'
  }, {
    id: 22,
    first_name: 'Pyotr',
    last_name: 'Angelini',
    email: 'pangelinil@bbc.co.uk'
  }, {
    id: 23,
    first_name: 'Frazer',
    last_name: 'Paffitt',
    email: 'fpaffittm@vimeo.com'
  }, {
    id: 24,
    first_name: 'Ainsley',
    last_name: 'Basnett',
    email: 'abasnettn@seesaa.net'
  }, {
    id: 25,
    first_name: 'Ally',
    last_name: 'Bonafacino',
    email: 'abonafacinoo@weebly.com'
  }, {
    id: 26,
    first_name: 'Sigmund',
    last_name: 'Scroxton',
    email: 'sscroxtonp@irs.gov'
  }, {
    id: 27,
    first_name: 'Tessa',
    last_name: 'Bilt',
    email: 'tbiltq@etsy.com'
  }, {
    id: 28,
    first_name: 'Rudd',
    last_name: 'Sprott',
    email: 'rsprottr@marriott.com'
  }, {
    id: 29,
    first_name: 'Libby',
    last_name: 'Maling',
    email: 'lmalings@ask.com'
  }, {
    id: 30,
    first_name: 'Pammy',
    last_name: 'Tregien',
    email: 'ptregient@berkeley.edu'
  }, {
    id: 31,
    first_name: 'Tabatha',
    last_name: 'Ogelbe',
    email: 'togelbeu@4shared.com'
  }, {
    id: 32,
    first_name: 'Sydney',
    last_name: 'Derrett',
    email: 'sderrettv@ning.com'
  }, {
    id: 33,
    first_name: 'Geno',
    last_name: 'Faherty',
    email: 'gfahertyw@liveinternet.ru'
  }, {
    id: 34,
    first_name: 'Adair',
    last_name: 'Munt',
    email: 'amuntx@mail.ru'
  }, {
    id: 35,
    first_name: 'Lanita',
    last_name: 'Lamas',
    email: 'llamasy@hp.com'
  }, {
    id: 36,
    first_name: 'Paul',
    last_name: 'Feavearyear',
    email: 'pfeavearyearz@dmoz.org'
  }, {
    id: 37,
    first_name: 'Nancie',
    last_name: 'Probey',
    email: 'nprobey10@hp.com'
  }, {
    id: 38,
    first_name: 'Johnathan',
    last_name: 'Degoy',
    email: 'jdegoy11@latimes.com'
  }, {
    id: 39,
    first_name: 'Lark',
    last_name: 'Whoston',
    email: 'lwhoston12@vkontakte.ru'
  }, {
    id: 40,
    first_name: 'Daffi',
    last_name: 'Pryke',
    email: 'dpryke13@independent.co.uk'
  }, {
    id: 41,
    first_name: 'Monroe',
    last_name: 'Goathrop',
    email: 'mgoathrop14@csmonitor.com'
  }, {
    id: 42,
    first_name: 'Aland',
    last_name: 'Sellor',
    email: 'asellor15@nature.com'
  }, {
    id: 43,
    first_name: 'Fiann',
    last_name: 'Kingman',
    email: 'fkingman16@hhs.gov'
  }, {
    id: 44,
    first_name: 'Rasla',
    last_name: 'Shelp',
    email: 'rshelp17@tripadvisor.com'
  }, {
    id: 45,
    first_name: 'La verne',
    last_name: 'Tolefree',
    email: 'ltolefree18@bravesites.com'
  }, {
    id: 46,
    first_name: 'Shantee',
    last_name: 'Crampin',
    email: 'scrampin19@pcworld.com'
  }, {
    id: 47,
    first_name: 'Johann',
    last_name: 'Iacovone',
    email: 'jiacovone1a@hatena.ne.jp'
  }, {
    id: 48,
    first_name: 'Melesa',
    last_name: 'Marking',
    email: 'mmarking1b@elegantthemes.com'
  }, {
    id: 49,
    first_name: 'Robbert',
    last_name: 'Etchingham',
    email: 'retchingham1c@berkeley.edu'
  }, {
    id: 50,
    first_name: 'Jojo',
    last_name: 'Phipps',
    email: 'jphipps1d@icio.us'
  }];
