const TOTAL_NUMBER_OF_QUOTES = 690;
// const LAST_ID_OF_FIRST_MOVIE = 281;
// const LAST_ID_OF_SECOND_MOVIE = 429;
// const LAST_ID_OF_THIRD_MOVIE = 690;

const movies =[
              "Found in all the Movies",
              "Star Wars: Episode I – The Phantom Menace (1999)",
              "Star Wars: Episode II – Attack of the Clones (2002)",
              "Star Wars: Episode III – Revenge of the Sith (2005)"
]

const memes = [
  ['Hello There','https://media.giphy.com/media/xTiIzJSKB4l7xTouE8/giphy.gif' ],
  ['The High Ground', 'https://y.yarn.co/bfb1c0e7-dcaa-42bf-8987-ca7477b2188e_text.gif'],
  ['I am the Senate', 'https://c.tenor.com/N19nWkkBBQoAAAAC/senate-palpatine.gif'],
  ['I don\'t like Sand', 'https://thumbs.gfycat.com/CaringIncompleteArchaeocete-max-1mb.gif'],
  ['Only a Sith deals in Absolutes', 'https://y.yarn.co/1a8ce731-5612-47d7-95a0-ce3c2ff25a55_text.gif'],
  ['Now this is Podracing!', 'https://y.yarn.co/a1da0680-9daf-4b33-aab7-4ce322770354_text.gif'],
  ['A surprise to be sure but a welcome one', 'https://y.yarn.co/24ddfcdc-affc-4026-b9d8-af11fd1a9d73_text.gif'],
  ['This is where the fun begins', 'https://y.yarn.co/2ba68a1a-8d66-43ee-b460-62a868fc2940_text.gif'],
  ['I love Democracy', 'https://y.yarn.co/e3898779-dcb9-4e67-82be-1841623f48c4_text.gif'],
  ['Take a Seat, young Skywalker', 'https://y.yarn.co/7e07413f-2b67-416e-8739-359647370c37_text.gif'],
  ['Unlimited Power!', 'https://y.yarn.co/b822abf6-7b16-4292-a0de-b3aac975d63b_text.gif'],
  ['Do it', 'https://media.giphy.com/media/3o84sw9CmwYpAnRRni/giphy.gif'],
  ['Another Happy Landing', 'https://c.tenor.com/e9yVO9Q1ckEAAAAC/kenobi-star-wars.gif'],
  ['Ironic', 'https://y.yarn.co/ca04faaa-3dda-4387-b0db-61083285415a_text.gif'],
  ['So uncivilized', 'https://y.yarn.co/66af609f-4014-46f2-b061-5951c605b58a_text.gif'],
  ['It\'s treason then', 'https://y.yarn.co/ab36b498-4cc6-48dc-8bae-13a14c12347b_text.gif'],
  ['Liar!', 'https://c.tenor.com/l3xkjzgkSdgAAAAM/liar-anakin.gif'],
  ['I hate you!', 'https://c.tenor.com/Dd0f2DxCotwAAAAC/star-wars-anakin-skywalker.gif'],
  ['Noooooo!!', 'https://c.tenor.com/Xp4a1oGXQGgAAAAC/noo-darth-vader.gif'],
  ['Not just the men but the women and children too', 'https://c.tenor.com/eyubxiGAADwAAAAd/anakin-star-wars.gif'],
  ['The ability to speak does not make you intelligent', 'https://y.yarn.co/b5198732-6dd2-47c4-a42b-dbd4b351d638_text.gif'],
  ['Boss Nass', 'https://media.giphy.com/media/3o7abDVadnHuA4NZwk/giphy.gif'],
  ['There\'s always a bigger fish', 'https://y.yarn.co/c43777d2-5aa6-462d-ac18-0631d70a602f_text.gif'],
  ['I have brought Peace, Security etc', 'https://i.pinimg.com/originals/e8/40/0b/e8400be4b6cf42cb62601c4d726b9e5c.gif'], //https://c.tenor.com/bmm3Xu9yMAMAAAAS/i-see-through-the-lies-of-the-jedi-i-have-brought-peace-freedom-justice-and-security-to-my-new-empire.gif
  ['Goooooood.', 'https://media.giphy.com/media/xTiIzL9Btjx9hegHT2/giphy.gif']

];

const characters = [
['Sheev Palpatine','Palpatine'], //array of Actor choices //left being choices that appear
['Watto','Watto'],
['Anakin Skywalker','Anakin Skywalker'],
['Mace Windu','Mace Windu'],
['Padme Amidala','Padme Amidala'],
['Obi-Wan Kenobi','Obi-Wan Kenobi'],
['Qui-Gon Jinn','Qui-Gon Jinn'],
['Greedo','Greedo'],
['Jango Fett','Jango Fett'],
['Queen Amidala','Queen Amidala'],
['Grandmaster Yoda','Yoda'],
['Jar Jar Binks', 'Jar Jar Binks'],
['Shmi Skywalker', 'Shmi Skywalker'],
['Darth Sidious', 'Darth Sidious'],
['Boss Nass','Boss Nass'],
['J.K Burtola','Jedi Child Jack'],
['General Grievous','General Grievous'],
['Count Dooku','Count Dooku'],
['Nute Gunray','Nute Gunray'],
['Darth Maul','Darth Maul'],
['Darth Vader','Darth Vader'],
['Mon Mothma','Mon Mothma'],
['C-3PO','C-3PO'],
['Sors Bandeam','Sors Bandeam'],
];

const actorPictures = new Map([
['Palpatine',
'https://4.bp.blogspot.com/-CY9BB38dzss/VD25QaYDgmI/AAAAAAAAEqE/AhmiSvwndM0/s1600/Palp_trustme.jpg'],
['Gregar Typho',
'https://static.wikia.nocookie.net/starwars/images/7/75/Typho_CVD.jpg/revision/latest?cb=20070909042751'],
['Watto',
'https://static.wikia.nocookie.net/starwars/images/e/eb/WattoHS.jpg/revision/latest?cb=20081222024729'],
['Anakin Skywalker',
'https://static.wikia.nocookie.net/starwars/images/6/6f/Anakin_Skywalker_RotS.png/revision/latest/scale-to-width-down/500?cb=20130621175844'],
['Mace Windu',
'https://static.wikia.nocookie.net/swfanon/images/7/7e/MaceWindu.jpg/revision/latest/scale-to-width-down/313?cb=20091206115140'],
['Padme Amidala',
'http://1.bp.blogspot.com/-P9QYCyNW3NQ/T-YSoELg6kI/AAAAAAAADWw/Wtw2OtLcN7w/s1600/Padme+17.jpg'],
['Obi-Wan Kenobi',
'https://images.indianexpress.com/2019/08/obi-wan-759.jpg'],
['Qui-Gon Jinn',
'https://wegotthiscovered.com/wp-content/uploads/2020/08/Qui-Gon-Jinn.jpeg'],
['Bail Organa',
'https://static.wikia.nocookie.net/moviemorgue/images/f/f4/Bail_organa.jpg/revision/latest?cb=20200428161135'],
['Greedo',
'https://static.wikia.nocookie.net/starwars/images/e/e2/GreedoTheElderTPM.jpg/revision/latest/scale-to-width-down/180?cb=20060629205617'],
['Jango Fett',
'https://static.wikia.nocookie.net/starwars/images/7/70/Jango_OP.jpg/revision/latest?cb=20071029210612'],
['Medical Droid',
'https://lumiere-a.akamaihd.net/v1/images/midwife-droid_131becd0.jpeg?region=0%2C0%2C1186%2C668&width=768'],
['Queen Amidala',
'https://static.wikia.nocookie.net/starwars/images/c/cf/PadmeAmidala-Awakenings.png/revision/latest?cb=20201007134923'],
['Yoda',
'https://static.wikia.nocookie.net/starwars/images/8/82/Yoda_Jedi_Temple.png/revision/latest?cb=20130621181350'],
['Lama Su',
'https://static.wikia.nocookie.net/starwars/images/7/73/Lama_Su.jpg/revision/latest?cb=20080117165735'],
['Jar Jar Binks',
 'https://upload.wikimedia.org/wikipedia/en/4/4b/Jjportrait.jpg'],
['Shmi Skywalker',
 'https://static.wikia.nocookie.net/starwars/images/1/17/Shmi_FF.png/revision/latest?cb=20160907060834'],
['Darth Sidious',
 'https://www.superherodb.com/pictures2/portraits/10/050/10462.jpg?v=1609072239'],
['Fode/Beed',
'https://lumiere-a.akamaihd.net/v1/images/databank_fodeandbeed_01_169_823c43bd.jpeg?region=0%2C0%2C1560%2C878&width=960'],
['Tuan We',
'https://static.wikia.nocookie.net/starwars/images/9/9c/TaunWe.jpg/revision/latest?cb=20080117164920'],
['Jocasta Nu',
'https://lumiere-a.akamaihd.net/v1/images/jocasta-nu_a3b32f08.jpeg?region=18%2C0%2C2208%2C1242&width=768'],
['Mas Amedda',
'https://static.wikia.nocookie.net/starwars/images/3/3f/Mas12432.jpg/revision/latest?cb=20130913002346'],
['Boss Nass',
'https://static.wikia.nocookie.net/starwars/images/6/63/BossNass-SWCT.png/revision/latest?cb=20200807030216'],
['Dexter Jettster',
'https://static.wikia.nocookie.net/swfanon/images/8/82/Dexter.jpg/revision/latest/top-crop/width/360/height/450?cb=20080628044024'],
['Rune Hakko',
'https://static.wikia.nocookie.net/the-star-wars-wiki/images/5/55/Rune_Dod.jpg/revision/latest/top-crop/width/360/height/450?cb=20200430112714'],
['Jedi Child Jack',
'https://static.wikia.nocookie.net/starwars/images/3/30/JK_Burtola.png/revision/latest?cb=20180721105522'],
['General Grievous',
'https://static.wikia.nocookie.net/disney/images/6/65/Profile_-_General_Grievous.png/revision/latest?cb=20190313134830'],
['Count Dooku',
'https://static.wikia.nocookie.net/villains/images/f/f5/Count-dooku.jpg/revision/latest?cb=20200111233859'],
['Ki-Adi-Mundi',
'https://static.wikia.nocookie.net/swfanon/images/e/e0/Ki_adi_mundi.jpg/revision/latest/top-crop/width/360/height/450?cb=20100121185832'],
['Nute Gunray',
'https://static.wikia.nocookie.net/starwarsofthecaribbean/images/d/d0/Nute_Gunray_%28new%29.jpg/revision/latest?cb=20200501060404'],
['Quarsh Panaka',
'https://static.wikia.nocookie.net/p__/images/0/0c/Captain_Panaka.jpg/revision/latest?cb=20141127114930&path-prefix=protagonist'],
['Darth Maul',
'https://static.wikia.nocookie.net/starwars/images/b/bf/Darth_Maul.png/revision/latest?cb=20150416221348'],
['Elan Sleazebaggano',
 'https://static.wikia.nocookie.net/headhuntersholosuite/images/d/d4/Elan_Sel%27Sabagno.jpg/revision/latest?cb=20171215182332'],
['Narrator',
'https://static.wikia.nocookie.net/disney/images/e/e9/Profile_-_R2-D2.jpg/revision/latest/scale-to-width-down/516?cb=20200418144202'],
['Darth Vader',
'https://i.pinimg.com/564x/d9/89/d0/d989d0c031721557cbe36fbd36cfa84c.jpg'],
['Mon Mothma',
'https://static.wikia.nocookie.net/disney/images/5/53/Rogue_One_photography_10.png/revision/latest?cb=20161107143007'],
['Bravo Two',
 'https://static.wikia.nocookie.net/starwars/images/6/63/Dolphe.jpg/revision/latest?cb=20061130081637'],
['C-3PO',
'https://static.wikia.nocookie.net/starwars/images/5/51/C-3PO_EP3.png/revision/latest?cb=20131005124036'],
['Giddean Danu',
'https://static.wikia.nocookie.net/starwars/images/4/44/Giddean_Danu.jpg/revision/latest?cb=20080116171219'],
['Sors Bandeam',
'https://static.wikia.nocookie.net/starwars/images/5/52/SorsBandeam.png/revision/latest?cb=20130206000500'],
['Sebulba',
'https://1.bp.blogspot.com/-yFrQTMk43Hs/XVA6dYdrhyI/AAAAAAAA8cQ/K1pAngE5vy0acMPQ8r4n0ghib6ciRh77wCLcBGAs/s1600/sebulba%2Bstar%2Bwars%2Bepisode%2Bone.jpg'],
['Jabba the Hutt',
'https://lumiere-a.akamaihd.net/v1/images/Jabba-The-Hutt_b5a08a70.jpeg?region=0%2C0%2C1200%2C675&width=768'],
['Poggle the Lesser',
'https://i.pinimg.com/736x/cd/51/20/cd5120a0a89f33bf2c2f54dcb8944c02.jpg'],
['Kitster',
'https://static.wikia.nocookie.net/starwars/images/a/a1/Kitster.png/revision/latest?cb=20180121195932'],
['Cliegg Lars',
'https://lumiere-a.akamaihd.net/v1/images/databank_cliegglars_01_169_c2f0b9cb.jpeg?region=0%2C0%2C1560%2C878&width=768'],
['Roos Tarpals',
'https://static.wikia.nocookie.net/starwars/images/d/d5/TarpalsHS-SWE.png/revision/latest?cb=20211214030207'],
['Wald',
'https://static.wikia.nocookie.net/starwars/images/b/bd/WaldFull-SWE.png/revision/latest?cb=20160914024029'],
['Finus Valorum',
'https://i.pinimg.com/originals/29/16/62/29166227119bf6376119c9d89c3d88c7.jpg']
]);

module.exports = {
                  movies,
                  characters,
                  actorPictures,
                  TOTAL_NUMBER_OF_QUOTES,
                  memes
                  // ,
                  // LAST_ID_OF_FIRST_MOVIE,
                  // LAST_ID_OF_SECOND_MOVIE,
                  // LAST_ID_OF_THIRD_MOVIE
                }
