import photo1 from '../images/photo1.webp';
import photo2 from '../images/photo2.webp';
import photo3 from '../images/photo3.webp';

import photo1Small from '../images/photo1-small.webp';
import photo2Small from '../images/photo2-small.webp';
import photo3Small from '../images/photo3-small.webp';

import mir from '../images/mir.svg';
import visa from '../images/visa.svg';
import master from '../images/mastercard.svg';
import maestro from '../images/maestro.svg';

export const products = [
  {
    link: photo1,
    id: 'element1',
    title: 'Футболка UZcotton мужская',
    brand: '',
    props: ['Цвет: белый', 'Размер: 56'],
    store: 'Коледино WB',
    company: 'OOO Вайлдберриз',
    companyData: 'Test',
    amount: [{ date: '5—6 февраля', amount: 1 }],
    inOneStock: 4,
    remainder: 3,
    price: 1051,
    disc: 0.5033,
    costDisc: 0.1,
    missing: true,
    thumbnail: photo1Small
  },
  {
    link: photo2,
    id: 'element2',
    title: 'Силиконовый чехол картхолдер (отверстия) для карт, прозрачный кейс бампер на Apple iPhone XR',
    brand: 'MobiSafe',
    props: ['Цвет: прозрачный'],
    store: 'Коледино WB',
    company: 'OOO Мегапрофстиль',
    companyData: 'Company data will be here',
    amount: [{ date: '5—6 февраля', amount: 184 }, { date: '7—8 февраля', amount: 16 }],
    inOneStock: 184,
    remainder: 1000000,
    price: 11500.235,
    disc: 0.0869548,
    costDisc: 0.1,
    missing: true,
    thumbnail: photo2Small
  },
  {
    link: photo3,
    id: 'element3',
    title: 'Карандаши цветные Faber-Castell "Замок", набор 24 цвета, заточенные, шестигранные',
    brand: 'Faber\u2011Castell',
    props: [],
    store: 'Коледино WB',
    company: 'OOO Вайлдберриз',
    companyData: 'Company data will be here',
    amount: [{ date: '5—6 февраля', amount: 2 }],
    inOneStock: 6,
    remainder: 4,
    price: 475,
    disc: 0.48,
    costDisc: 0.1,
    missing: true,
    thumbnail: photo3Small
  },

];

const groupedProducts = {};

//create array of delivery dates
products.forEach(product => {
  const amounts = product.amount;

  amounts.forEach(amountObj => {
    const { date, amount } = amountObj;

    const productInfo = {
      id: product.id,
      amount: amount,
      title: product.title,
      thumbnail: product.thumbnail
    };

    if (!groupedProducts[date]) {
      groupedProducts[date] = {
        date: date,
        products: [productInfo]
      };
    } else {
      groupedProducts[date].products.push(productInfo);
    }
  });
});

export const deliveryDates = Object.values(groupedProducts);

export const missingProducts = [
  {
    link: photo1,
    title: 'Футболка UZcotton мужская',
    brand: '',
    props: ['Цвет: белый', 'Размер: 56'],
    store: 'Коледино WB',
    company: 'OOO Вайлдберриз',
    companyData: 'Test',
    amount: 1,
    remainder: 2,
    price: 1051,
    disc: 0.5033,
    costDisc: 0.1,
    missing: true
  },
  {
    link: photo2,
    title: 'Силиконовый чехол картхолдер (отверстия) для карт, прозрачный кейс бампер на Apple iPhone XR',
    brand: 'MobiSafe',
    props: ['Цвет: прозрачный'],
    store: 'Коледино WB',
    company: 'OOO Мегапрофстиль',
    companyData: 'Company data will be here',
    amount: 200,
    remainder: '',
    price: 11500.235,
    disc: 0.0869548,
    costDisc: 0.1,
    missing: true
  },
  {
    link: photo3,
    title: 'Карандаши цветные Faber-Castell "Замок", набор 24 цвета, заточенные, шестигранные',
    brand: 'Faber-Castell',
    props: [],
    store: 'Коледино WB',
    company: 'OOO Вайлдберриз',
    companyData: 'Company data will be here',
    amount: 2,
    remainder: 2,
    price: 475,
    disc: 0.48,
    costDisc: 0.1,
    missing: true
  },

];

export const addressesData = [
  {
    address: 'Бишкек, улица Табышалиева, 57',
    checked: true,
    type: 'courier'
  },
  {
    address: 'Бишкек, улица Жукеева-Пудовкина, 77/1',
    checked: false,
    type: 'courier'
  },
  {
    address: 'Бишкек, микрорайон Джал, улица Ахунбаева Исы, 67/1',
    checked: false,
    type: 'courier'

  }
];

export const pickupAddressesData = [
  {
    address: 'Бишкек, улица Ахматбека Суюмбаева, 12/1',
    rating: 0,
    checked: true,
    type: 'pickUp'
  },
  {
    address: 'Бишкек, микрорайон Джал, улица Ахунбаева Исы, д. 67/1 ',
    rating: 4.99,
    checked: false,
    type: 'pickUp'
  },
  {
    address: 'Бишкек, улица Табышалиева, д. 57 ',
    rating: 4.99,
    checked: false,
    type: 'pickUp'
  }
];

export const bankCards = [
  {
    number: '1234 56•• •••• 1234',
    logo: mir,
    name: 'Карта Мир',
    validity: '01/30',
    checked: true
  },
  {
    number: '1234 56•• •••• 1235',
    logo: visa,
    name: 'Карта Visa',
    validity: '01/30',
    checked: false
  },
  {
    number: '1234 56•• •••• 1236',
    logo: master,
    name: 'Карта MasterCard',
    validity: '01/30',
    checked: false
  },
  {
    number: '1234 56•• •••• 1237',
    logo: maestro,
    name: 'Maestro',
    validity: '01/30',
    checked: false
  },


];

export const companyData = [
  {
    company: 'OOO Мегапрофстиль',
    companyTooltip: 'OOO «МЕГАПРОФСТИЛЬ»',
    ogrn: 'ОГРН: 5167746237148',
    address: '129337, Москва, улица Красная Сосна, 2, корпус 1, стр. 1, помещение 2, офис 34'
  },
  {
    company: 'OOO Вайлдберриз',
    companyTooltip: 'ООО «Вайлдберриз»',
    ogrn: 'ОГРН: 1067746062449',
    address: '142181, Московская область, г. Подольск, деревня Коледино, Территория Индустриальный парк Коледино, д. 6, стр. 1'
  },
];
