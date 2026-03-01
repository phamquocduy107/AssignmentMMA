import { Feedback } from '@/types/handbag';

const mockFeedback: Record<string, Feedback> = {
  '1': {
    handbagId: '1',
    averageRating: 4.5,
    totalReviews: 28,
    breakdown: [
      { stars: 5, count: 15 },
      { stars: 4, count: 8 },
      { stars: 3, count: 3 },
      { stars: 2, count: 1 },
      { stars: 1, count: 1 },
    ],
    comments: [
      { id: 'c1', author: 'Sophie M.', avatar: 'SM', rating: 5, text: 'Absolutely stunning bag! The red color is vivid and the leather quality is exceptional.', date: 'Jan 12, 2025' },
      { id: 'c2', author: 'Lily T.', avatar: 'LT', rating: 4, text: 'Very elegant and well-crafted. Only wish it had a slightly larger strap.', date: 'Feb 3, 2025' },
      { id: 'c3', author: 'Rachel K.', avatar: 'RK', rating: 5, text: 'Perfect size for everyday use. Gets compliments everywhere I go!', date: 'Feb 28, 2025' },
    ],
  },
  '2': {
    handbagId: '2',
    averageRating: 4.2,
    totalReviews: 42,
    breakdown: [
      { stars: 5, count: 20 },
      { stars: 4, count: 12 },
      { stars: 3, count: 7 },
      { stars: 2, count: 2 },
      { stars: 1, count: 1 },
    ],
    comments: [
      { id: 'c1', author: 'Anna W.', avatar: 'AW', rating: 4, text: 'Great value for a Michael Kors bag. The monogram print looks luxurious.', date: 'Dec 5, 2024' },
      { id: 'c2', author: 'Megan L.', avatar: 'ML', rating: 5, text: 'Love this bag! Fits everything I need for a day out.', date: 'Jan 20, 2025' },
      { id: 'c3', author: 'Tina P.', avatar: 'TP', rating: 3, text: 'Good quality but the shoulder strap could be more comfortable.', date: 'Feb 10, 2025' },
    ],
  },
  '3': {
    handbagId: '3',
    averageRating: 4.0,
    totalReviews: 19,
    breakdown: [
      { stars: 5, count: 8 },
      { stars: 4, count: 6 },
      { stars: 3, count: 3 },
      { stars: 2, count: 1 },
      { stars: 1, count: 1 },
    ],
    comments: [
      { id: 'c1', author: 'Claire B.', avatar: 'CB', rating: 4, text: 'Classic Burberry quality. The silver and gray color combination is very chic.', date: 'Nov 15, 2024' },
      { id: 'c2', author: 'Janet H.', avatar: 'JH', rating: 5, text: 'Excellent craftsmanship. I receive so many compliments on this!', date: 'Jan 8, 2025' },
    ],
  },
  '4': {
    handbagId: '4',
    averageRating: 4.7,
    totalReviews: 33,
    breakdown: [
      { stars: 5, count: 22 },
      { stars: 4, count: 8 },
      { stars: 3, count: 2 },
      { stars: 2, count: 1 },
      { stars: 1, count: 0 },
    ],
    comments: [
      { id: 'c1', author: 'Elena R.', avatar: 'ER', rating: 5, text: 'The Ferragamo logo embroidery is so refined. Perfect for evening occasions.', date: 'Jan 25, 2025' },
      { id: 'c2', author: 'Paula G.', avatar: 'PG', rating: 5, text: 'Impeccable quality and the red is a head-turner. Worth every penny.', date: 'Feb 14, 2025' },
    ],
  },
  '5': {
    handbagId: '5',
    averageRating: 3.8,
    totalReviews: 15,
    breakdown: [
      { stars: 5, count: 5 },
      { stars: 4, count: 4 },
      { stars: 3, count: 3 },
      { stars: 2, count: 2 },
      { stars: 1, count: 1 },
    ],
    comments: [
      { id: 'c1', author: 'Isabelle C.', avatar: 'IC', rating: 4, text: 'The cut-out detail is unique and modern. Lightweight material too.', date: 'Dec 20, 2024' },
      { id: 'c2', author: 'Marcus D.', avatar: 'MD', rating: 3, text: 'Nice design but the black fades slightly over time.', date: 'Feb 5, 2025' },
    ],
  },
  '6': {
    handbagId: '6',
    averageRating: 4.9,
    totalReviews: 55,
    breakdown: [
      { stars: 5, count: 45 },
      { stars: 4, count: 7 },
      { stars: 3, count: 2 },
      { stars: 2, count: 1 },
      { stars: 1, count: 0 },
    ],
    comments: [
      { id: 'c1', author: 'Victoria S.', avatar: 'VS', rating: 5, text: 'The Peekaboo is an icon. Worth every cent and gets better with age.', date: 'Jan 3, 2025' },
      { id: 'c2', author: 'Nadia F.', avatar: 'NF', rating: 5, text: 'Bought as a gift for myself. Pure luxury from Fendi!', date: 'Feb 22, 2025' },
      { id: 'c3', author: 'Charlotte L.', avatar: 'CL', rating: 5, text: 'Simply the most beautiful bag I own. Fendi never disappoints.', date: 'Mar 1, 2025' },
    ],
  },
  '7': {
    handbagId: '7',
    averageRating: 4.3,
    totalReviews: 22,
    breakdown: [
      { stars: 5, count: 11 },
      { stars: 4, count: 7 },
      { stars: 3, count: 3 },
      { stars: 2, count: 1 },
      { stars: 1, count: 0 },
    ],
    comments: [
      { id: 'c1', author: 'Henry A.', avatar: 'HA', rating: 4, text: 'Great compact card case with a crossbody option. Very practical.', date: 'Dec 10, 2024' },
      { id: 'c2', author: 'Stella J.', avatar: 'SJ', rating: 5, text: 'Fits my essentials perfectly. The sesame color is so warm and rich.', date: 'Jan 30, 2025' },
    ],
  },
  '8': {
    handbagId: '8',
    averageRating: 4.1,
    totalReviews: 18,
    breakdown: [
      { stars: 5, count: 8 },
      { stars: 4, count: 6 },
      { stars: 3, count: 2 },
      { stars: 2, count: 1 },
      { stars: 1, count: 1 },
    ],
    comments: [
      { id: 'c1', author: 'George B.', avatar: 'GB', rating: 4, text: 'Sleek and professional. The Bvlgari black folded card holder is a must-have for business.', date: 'Nov 20, 2024' },
    ],
  },
  '9': {
    handbagId: '9',
    averageRating: 4.4,
    totalReviews: 60,
    breakdown: [
      { stars: 5, count: 30 },
      { stars: 4, count: 18 },
      { stars: 3, count: 8 },
      { stars: 2, count: 3 },
      { stars: 1, count: 1 },
    ],
    comments: [
      { id: 'c1', author: 'Chloe N.', avatar: 'CN', rating: 5, text: 'Perfect small wallet. So chic for the price!', date: 'Jan 15, 2025' },
      { id: 'c2', author: 'Julia T.', avatar: 'JT', rating: 4, text: 'Love the beige color. Great for summer looks.', date: 'Feb 18, 2025' },
    ],
  },
  '10': {
    handbagId: '10',
    averageRating: 4.0,
    totalReviews: 30,
    breakdown: [
      { stars: 5, count: 12 },
      { stars: 4, count: 10 },
      { stars: 3, count: 5 },
      { stars: 2, count: 2 },
      { stars: 1, count: 1 },
    ],
    comments: [
      { id: 'c1', author: 'Olivia R.', avatar: 'OR', rating: 4, text: 'Great tri-fold design and material. Very functional.', date: 'Dec 28, 2024' },
    ],
  },
  '11': {
    handbagId: '11',
    averageRating: 4.6,
    totalReviews: 38,
    breakdown: [
      { stars: 5, count: 22 },
      { stars: 4, count: 10 },
      { stars: 3, count: 4 },
      { stars: 2, count: 1 },
      { stars: 1, count: 1 },
    ],
    comments: [
      { id: 'c1', author: 'Aria M.', avatar: 'AM', rating: 5, text: 'The edamame color is stunning – so unique! Fendi quality at its finest.', date: 'Feb 1, 2025' },
      { id: 'c2', author: 'Diana K.', avatar: 'DK', rating: 4, text: 'Cute Peekaboo card case pouch. Love using it as a mini bag.', date: 'Feb 25, 2025' },
    ],
  },
  '12': {
    handbagId: '12',
    averageRating: 4.8,
    totalReviews: 21,
    breakdown: [
      { stars: 5, count: 16 },
      { stars: 4, count: 3 },
      { stars: 3, count: 1 },
      { stars: 2, count: 1 },
      { stars: 1, count: 0 },
    ],
    comments: [
      { id: 'c1', author: 'Marina V.', avatar: 'MV', rating: 5, text: 'The white leather tote is immaculate. True Bvlgari luxury.', date: 'Jan 22, 2025' },
    ],
  },
  '13': {
    handbagId: '13',
    averageRating: 4.5,
    totalReviews: 45,
    breakdown: [
      { stars: 5, count: 25 },
      { stars: 4, count: 12 },
      { stars: 3, count: 5 },
      { stars: 2, count: 2 },
      { stars: 1, count: 1 },
    ],
    comments: [
      { id: 'c1', author: 'Serena B.', avatar: 'SB', rating: 5, text: 'The First Sight flap is divine! The blue is gorgeous and the hardware is gold-toned perfection.', date: 'Feb 7, 2025' },
      { id: 'c2', author: 'Bianca C.', avatar: 'BC', rating: 4, text: 'Incredibly chic. Worth the splurge for a Fendi piece.', date: 'Mar 1, 2025' },
    ],
  },
  '14': {
    handbagId: '14',
    averageRating: 4.2,
    totalReviews: 16,
    breakdown: [
      { stars: 5, count: 8 },
      { stars: 4, count: 4 },
      { stars: 3, count: 2 },
      { stars: 2, count: 1 },
      { stars: 1, count: 1 },
    ],
    comments: [
      { id: 'c1', author: 'Petra M.', avatar: 'PM', rating: 4, text: 'Beautiful Bvlgari wallet. The light blue cyan color is very fresh and unique.', date: 'Jan 9, 2025' },
    ],
  },
};

export function getFeedback(handbagId: string): Feedback {
  return (
    mockFeedback[handbagId] ?? {
      handbagId,
      averageRating: 4.0,
      totalReviews: 10,
      breakdown: [
        { stars: 5, count: 5 },
        { stars: 4, count: 3 },
        { stars: 3, count: 1 },
        { stars: 2, count: 1 },
        { stars: 1, count: 0 },
      ],
      comments: [
        { id: 'default', author: 'Verified Buyer', avatar: 'VB', rating: 4, text: 'Great product, highly recommend!', date: 'Jan 1, 2025' },
      ],
    }
  );
}
