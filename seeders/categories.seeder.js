var Seeder = require('mongoose-data-seed').Seeder;
var Category = require('../server/datasource/schemas').Category;

var gradek = [
  {
    identifier: 'CCSS.Math.Content.K.G.B.6',
    description: 'Compose simple shapes to form larger shapes.',
    url: 'http://corestandards.org/Math/Content/K/G/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.K.G.B.5',
    description: 'Model shapes in the world by building shapes from components (e.g., sticks and clay balls) and drawing shapes.',
    url: 'http://corestandards.org/Math/Content/K/G/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.K.G.B.4',
    description: 'Analyze and compare two- and three-dimensional shapes, in different sizes and orientations, using informal language to describe their similarities, differences, parts (e.g., number of sides and vertices/"corners") and other attributes (e.g., having sides of equal length).',
    url: 'http://corestandards.org/Math/Content/K/G/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.K.G.B',
    description: 'Analyze, compare, create, and compose shapes.',
    url: 'http://corestandards.org/Math/Content/K/G/B'
  },
  {
    identifier: 'CCSS.Math.Content.K.G.A.3',
    description: 'Identify shapes as two-dimensional (lying in a plane, "flat") or three-dimensional ("solid").',
    url: 'http://corestandards.org/Math/Content/K/G/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.K.G.A.2',
    description: 'Correctly name shapes regardless of their orientations or overall size.',
    url: 'http://corestandards.org/Math/Content/K/G/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.K.G.A.1',
    description: 'Describe objects in the environment using names of shapes, and describe the relative positions of these objects using terms such as above, below, beside, in front of, behind, and next to.',
    url: 'http://corestandards.org/Math/Content/K/G/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.K.G.A',
    description: 'Identify and describe shapes (squares, circles, triangles, rectangles, hexagons, cubes, cones, cylinders, and spheres).',
    url: 'http://corestandards.org/Math/Content/K/G/A'
  },
  {
    identifier: 'CCSS.Math.Content.K.G',
    description: 'Geometry',
    url: 'http://www.corestandards.org/Math/Content/K/G/'
  },
  {
    identifier: 'CCSS.Math.Content.K.MD.B.3',
    description: 'Classify objects into given categories; count the numbers of objects in each category and sort the categories by count.',
    url: 'http://corestandards.org/Math/Content/K/MD/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.K.MD.B',
    description: 'Classify objects and count the number of objects in each category.',
    url: 'http://corestandards.org/Math/Content/K/MD/B'
  },
  {
    identifier: 'CCSS.Math.Content.K.MD.A.2',
    description: 'Directly compare two objects with a measurable attribute in common, to see which object has "more of"/"less of" the attribute, and describe the difference.',
    url: 'http://corestandards.org/Math/Content/K/MD/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.K.MD.A.1',
    description: 'Describe measurable attributes of objects, such as length or weight. Describe several measurable attributes of a single object.',
    url: 'http://corestandards.org/Math/Content/K/MD/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.K.MD.A',
    description: 'Describe and compare measurable attributes.',
    url: 'http://corestandards.org/Math/Content/K/MD/A'
  },
  {
    identifier: 'CCSS.Math.Content.K.MD',
    description: 'Measurement and Data',
    url: 'http://corestandards.org/Math/Content/K/MD'
  },
  {
    identifier: 'CCSS.Math.Content.K.NBT.A.1',
    description: 'Compose and decompose numbers from 11 to 19 into ten ones and some further ones, e.g., by using objects or drawings, and record each composition or decomposition by a drawing or equation (e.g., 18 = 10 + 8); understand that these numbers are composed of ten ones and one, two, three, four, five, six, seven, eight, or nine ones.',
    url: 'http://corestandards.org/Math/Content/K/NBT/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.K.NBT.A',
    description: 'Work with numbers 11—19 to gain foundations for place value.',
    url: 'http://corestandards.org/Math/Content/K/NBT/A'
  },
  {
    identifier: 'CCSS.Math.Content.K.NBT',
    description: 'Number and Operations in Base Ten',
    url: 'http://corestandards.org/Math/Content/K/NBT'
  },
  {
    identifier: 'CCSS.Math.Content.K.OA.A.5',
    description: 'Fluently add and subtract within 5.',
    url: 'http://corestandards.org/Math/Content/K/OA/A/5'
  },
  {
    identifier: 'CCSS.Math.Content.K.OA.A.4',
    description: 'For any number from 1 to 9, find the number that makes 10 when added to the given number, e.g., by using objects or drawings, and record the answer with a drawing or equation.',
    url: 'http://corestandards.org/Math/Content/K/OA/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.K.OA.A.3',
    description: 'Decompose numbers less than or equal to 10 into pairs in more than one way, e.g., by using objects or drawings, and record each decomposition by a drawing or equation (e.g., 5 = 2 + 3 and 5 = 4 + 1).',
    url: 'http://corestandards.org/Math/Content/K/OA/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.K.OA.A.2',
    description: 'Solve addition and subtraction word problems, and add and subtract within 10, e.g., by using objects or drawings to represent the problem.',
    url: 'http://corestandards.org/Math/Content/K/OA/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.K.OA.A.1',
    description: 'Represent addition and subtraction with objects, fingers, mental images, drawings, sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations.',
    url: 'http://corestandards.org/Math/Content/K/OA/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.K.OA.A',
    description: 'Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.',
    url: 'http://corestandards.org/Math/Content/K/OA/A'
  },
  {
    identifier: 'CCSS.Math.Content.K.OA',
    description: 'Operations and Algebraic Thinking',
    url: 'http://corestandards.org/Math/Content/K/OA'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.C.7',
    description: 'Compare two numbers between 1 and 10 presented as written numerals.',
    url: 'http://corestandards.org/Math/Content/K/CC/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.C.6',
    description: 'Identify whether the number of objects in one group is greater than, less than, or equal to the number of objects in another group, e.g., by using matching and counting strategies.',
    url: 'http://corestandards.org/Math/Content/K/CC/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.C',
    description: 'Compare numbers.',
    url: 'http://corestandards.org/Math/Content/K/CC/C'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.B.5',
    description: 'Count to answer "how many?" questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration; given a number from 1—20, count out that many objects.',
    url: 'http://corestandards.org/Math/Content/K/CC/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.B.4c',
    description: 'Understand that each successive number name refers to a quantity that is one larger.',
    url: 'http://corestandards.org/Math/Content/K/CC/B/4/c'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.B.4b',
    description: 'Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted.',
    url: 'http://corestandards.org/Math/Content/K/CC/B/4/b'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.B.4a',
    description: 'When counting objects, say the number names in the standard order, pairing each object with one and only one number name and each number name with one and only one object.',
    url: 'http://corestandards.org/Math/Content/K/CC/B/4/a'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.B.4',
    description: 'Understand the relationship between numbers and quantities; connect counting to cardinality.',
    url: 'http://corestandards.org/Math/Content/K/CC/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.B',
    description: 'Count to tell the number of objects.',
    url: 'http://corestandards.org/Math/Content/K/CC/B'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.A.3',
    description: 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).',
    url: 'http://corestandards.org/Math/Content/K/CC/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.A.2',
    description: 'Count forward beginning from a given number within the known sequence (instead of having to begin at 1).',
    url: 'http://corestandards.org/Math/Content/K/CC/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.A.1',
    description: 'Count to 100 by ones and by tens.',
    url: 'http://corestandards.org/Math/Content/K/CC/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.A',
    description: 'Know number names and the count sequence.',
    url: 'http://corestandards.org/Math/Content/K/CC/A'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC',
    description: 'Counting and Cardinality',
    url: 'http://corestandards.org/Math/Content/K/CC'
  }
]

var grade1 = [
  {
    identifier: 'CCSS.Math.Content.1',
    description: 'Grade 1',
    url: 'http://corestandards.org/Math/Content/1'
  },
  {
    identifier: 'CCSS.Math.Content.1.G.A.3',
    description: 'Partition circles and rectangles into two and four equal shares, describe the shares using the words halves, fourths, and quarters, and use the phrases half of, fourth of, and quarter of. Describe the whole as two of, or four of the shares. Understand for these examples that decomposing into more equal shares creates smaller shares.',
    url: 'http://corestandards.org/Math/Content/1/G/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.1.G.A.2',
    description: 'Compose two-dimensional shapes (rectangles, squares, trapezoids, triangles, half-circles, and quarter-circles) or three-dimensional shapes (cubes, right rectangular prisms, right circular cones, and right circular cylinders) to create a composite shape, and compose new shapes from the composite shape.',
    url: 'http://corestandards.org/Math/Content/1/G/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.1.G.A.1',
    description: 'Distinguish between defining attributes (e.g., triangles are closed and three-sided) versus non-defining attributes (e.g., color, orientation, overall size); build and draw shapes to possess defining attributes.',
    url: 'http://corestandards.org/Math/Content/1/G/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.1.G.A',
    description: 'Reason with shapes and their attributes.',
    url: 'http://corestandards.org/Math/Content/1/G/A'
  },
  {
    identifier: 'CCSS.Math.Content.1.G',
    description: 'Geometry',
    url: 'http://www.corestandards.org/Math/Content/1/G/'
  },
  {
    identifier: 'CCSS.Math.Content.1.MD.C.4',
    description: 'Organize, represent, and interpret data with up to three categories; ask and answer questions about the total number of data points, how many in each category, and how many more or less are in one category than in another.',
    url: 'http://corestandards.org/Math/Content/1/MD/C/4'
  },
  {
    identifier: 'CCSS.Math.Content.1.MD.C',
    description: 'Represent and interpret data.',
    url: 'http://corestandards.org/Math/Content/1/MD/C'
  },
  {
    identifier: 'CCSS.Math.Content.1.MD.B.3',
    description: 'Tell and write time in hours and half-hours using analog and digital clocks.',
    url: 'http://corestandards.org/Math/Content/1/MD/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.1.MD.B',
    description: 'Tell and write time.',
    url: 'http://corestandards.org/Math/Content/1/MD/B'
  },
  {
    identifier: 'CCSS.Math.Content.1.MD.A.2',
    description: 'Express the length of an object as a whole number of length units, by laying multiple copies of a shorter object (the length unit) end to end; understand that the length measurement of an object is the number of same-size length units that span it with no gaps or overlaps.',
    url: 'http://corestandards.org/Math/Content/1/MD/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.1.MD.A.1',
    description: 'Order three objects by length; compare the lengths of two objects indirectly by using a third object.',
    url: 'http://corestandards.org/Math/Content/1/MD/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.1.MD.A',
    description: 'Measure lengths indirectly and by iterating length units.',
    url: 'http://corestandards.org/Math/Content/1/MD/A'
  },
  {
    identifier: 'CCSS.Math.Content.1.MD',
    description: 'Measurement and Data',
    url: 'http://www.corestandards.org/Math/Content/1/MD/'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.C.6',
    description: 'Subtract multiples of 10 in the range 10-90 from multiples of 10 in the range 10-90 (positive or zero differences), using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used.',
    url: 'http://corestandards.org/Math/Content/1/NBT/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.C.5',
    description: 'Given a two-digit number, mentally find 10 more or 10 less than the number, without having to count; explain the reasoning used.',
    url: 'http://corestandards.org/Math/Content/1/NBT/C/5'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.C.4',
    description: 'Add within 100, including adding a two-digit number and a one-digit number, and adding a two-digit number and a multiple of 10, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used. Understand that in adding two-digit numbers, one adds tens and tens, ones and ones; and sometimes it is necessary to compose a ten.',
    url: 'http://corestandards.org/Math/Content/1/NBT/C/4'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.C',
    description: 'Use place value understanding and properties of operations to add and subtract.',
    url: 'http://corestandards.org/Math/Content/1/NBT/C'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.B.3',
    description: 'Compare two two-digit numbers based on meanings of the tens and ones digits, recording the results of comparisons with the symbols >, =, and <.',
    url: 'http://corestandards.org/Math/Content/1/NBT/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.B.2c',
    description: 'The numbers 10, 20, 30, 40, 50, 60, 70, 80, 90 refer to one, two, three, four, five, six, seven, eight, or nine tens (and 0 ones).',
    url: 'http://corestandards.org/Math/Content/1/NBT/B/2/c'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.B.2b',
    description: 'The numbers from 11 to 19 are composed of a ten and one, two, three, four, five, six, seven, eight, or nine ones.',
    url: 'http://corestandards.org/Math/Content/1/NBT/B/2/b'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.B.2a',
    description: '10 can be thought of as a bundle of ten ones — called a "ten."',
    url: 'http://corestandards.org/Math/Content/1/NBT/B/2/a'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.B.2',
    description: 'Understand that the two digits of a two-digit number represent amounts of tens and ones. Understand the following as special cases:',
    url: 'http://corestandards.org/Math/Content/1/NBT/B/2'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.B',
    description: 'Understand place value.',
    url: 'http://corestandards.org/Math/Content/1/NBT/B'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.A.1',
    description: 'Count to 120, starting at any number less than 120. In this range, read and write numerals and represent a number of objects with a written numeral.',
    url: 'http://corestandards.org/Math/Content/1/NBT/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.A',
    description: 'Extend the counting sequence.',
    url: 'http://corestandards.org/Math/Content/1/NBT/A'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT',
    description: 'Number and Operations in Base Ten',
    url: 'http://www.corestandards.org/Math/Content/1/NBT/'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.D.8',
    description: 'Determine the unknown whole number in an addition or subtraction equation relating three whole numbers.',
    url: 'http://corestandards.org/Math/Content/1/OA/D/8'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.D.7',
    description: 'Understand the meaning of the equal sign, and determine if equations involving addition and subtraction are true or false.',
    url: 'http://corestandards.org/Math/Content/1/OA/D/7'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.D',
    description: 'Work with addition and subtraction equations.',
    url: 'http://corestandards.org/Math/Content/1/OA/D'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.C.6',
    description: 'Add and subtract within 20, demonstrating fluency for addition and subtraction within 10. Use strategies such as counting on; making ten (e.g., 8 + 6 = 8 + 2 + 4 = 10 + 4 = 14); decomposing a number leading to a ten (e.g., 13 - 4 = 13 - 3 - 1 = 10 - 1 = 9); using the relationship between addition and subtraction (e.g., knowing that 8 + 4 = 12, one knows 12 - 8 = 4); and creating equivalent but easier or known sums (e.g., adding 6 + 7 by creating the known equivalent 6 + 6 + 1 = 12 + 1 = 13).',
    url: 'http://corestandards.org/Math/Content/1/OA/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.C.5',
    description: 'Relate counting to addition and subtraction (e.g., by counting on 2 to add 2).',
    url: 'http://corestandards.org/Math/Content/1/OA/C/5'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.C',
    description: 'Add and subtract within 20.',
    url: 'http://corestandards.org/Math/Content/1/OA/C'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.B.4',
    description: 'Understand subtraction as an unknown-addend problem.',
    url: 'http://corestandards.org/Math/Content/1/OA/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.B.3',
    description: 'Apply properties of operations as strategies to add and subtract.',
    url: 'http://corestandards.org/Math/Content/1/OA/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.B',
    description: 'Understand and apply properties of operations and the relationship between addition and subtraction.',
    url: 'http://corestandards.org/Math/Content/1/OA/B'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.A.2',
    description: 'Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.',
    url: 'http://corestandards.org/Math/Content/1/OA/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.A.1',
    description: 'Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.',
    url: 'http://corestandards.org/Math/Content/1/OA/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA.A',
    description: 'Represent and solve problems involving addition and subtraction.',
    url: 'http://corestandards.org/Math/Content/1/OA/A'
  },
  {
    identifier: 'CCSS.Math.Content.1.OA',
    description: 'Operations and Algebraic Thinking',
    url: 'http://www.corestandards.org/Math/Content/1/OA/'
  },
  {
    identifier: 'CCSS.Math.Practice.MP8',
    description: 'Look for and express regularity in repeated reasoning.',
    url: 'http://corestandards.org/Math/Practice/MP8'
  },
  {
    identifier: 'CCSS.Math.Practice.MP7',
    description: 'Look for and make use of structure.',
    url: 'http://corestandards.org/Math/Practice/MP7'
  },
  {
    identifier: 'CCSS.Math.Practice.MP6',
    description: 'Attend to precision.',
    url: 'http://corestandards.org/Math/Practice/MP6'
  },
  {
    identifier: 'CCSS.Math.Practice.MP5',
    description: 'Use appropriate tools strategically.',
    url: 'http://corestandards.org/Math/Practice/MP5'
  },
  {
    identifier: 'CCSS.Math.Practice.MP4',
    description: 'Model with mathematics.',
    url: 'http://corestandards.org/Math/Practice/MP4'
  },
  {
    identifier: 'CCSS.Math.Practice.MP3',
    description: 'Construct viable arguments and critique the reasoning of others.',
    url: 'http://corestandards.org/Math/Practice/MP3'
  },
  {
    identifier: 'CCSS.Math.Practice.MP2',
    description: 'Reason abstractly and quantitatively.',
    url: 'http://corestandards.org/Math/Practice/MP2'
  },
  {
    identifier: 'CCSS.Math.Practice.MP1',
    description: 'Make sense of problems and persevere in solving them.',
    url: 'http://corestandards.org/Math/Practice/MP1'
  },
  {
    identifier: 'CCSS.Math.Practice.MP1',
    description: 'Standards for Mathematical Practice',
    url: 'http://www.corestandards.org/Math/Practice/'
  }
];

var grade2 = [
   {
     identifier: 'CCSS.Math.Content.2.G.A.3',
     description: 'Partition circles and rectangles into two, three, or four equal shares, describe the shares using the words halves, thirds, half of, a third of, etc., and describe the whole as two halves, three thirds, four fourths. Recognize that equal shares of identical wholes need not have the same shape.',
     url: 'http://corestandards.org/Math/Content/2/G/A/3'
   }, {
     identifier: 'CCSS.Math.Content.2.G.A.2',
     description: 'Partition a rectangle into rows and columns of same-size squares and count to find the total number of them.',
     url: 'http://corestandards.org/Math/Content/2/G/A/2'
   }, {
     identifier: 'CCSS.Math.Content.2.G.A.1',
     description: 'Recognize and draw shapes having specified attributes, such as a given number of angles or a given number of equal faces. Identify triangles, quadrilaterals, pentagons, hexagons, and cubes.',
     url: 'http://corestandards.org/Math/Content/2/G/A/1'
   }, {
     identifier: 'CCSS.Math.Content.2.G.A',
     description: 'Reason with shapes and their attributes.',
     url: 'http://corestandards.org/Math/Content/2/G/A'
   }, {
     identifier: 'CCSS.Math.Content.2.G',
     description: 'Geometry',
     url: 'http://corestandards.org/Math/Content/2/G'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.D.10',
     description: 'Draw a picture graph and a bar graph (with single-unit scale) to represent a data set with up to four categories. Solve simple put-together, take-apart, and compare problems using information presented in a bar graph.',
     url: 'http://corestandards.org/Math/Content/2/MD/D/10'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.D.9',
     description: 'Generate measurement data by measuring lengths of several objects to the nearest whole unit, or by making repeated measurements of the same object. Show the measurements by making a line plot, where the horizontal scale is marked off in whole-number units.',
     url: 'http://corestandards.org/Math/Content/2/MD/D/9'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.D',
     description: 'Represent and interpret data.',
     url: 'http://corestandards.org/Math/Content/2/MD/D'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.C.8',
     description: 'Solve word problems involving dollar bills, quarters, dimes, nickels, and pennies, using $ and ¢ symbols appropriately.',
     url: 'http://corestandards.org/Math/Content/2/MD/C/8'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.C.7',
     description: 'Tell and write time from analog and digital clocks to the nearest five minutes, using a.m. and p.m.',
     url: 'http://corestandards.org/Math/Content/2/MD/C/7'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.C',
     description: 'Work with time and money.',
     url: 'http://corestandards.org/Math/Content/2/MD/C'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.B.6',
     description: 'Represent whole numbers as lengths from 0 on a number line diagram with equally spaced points corresponding to the numbers 0, 1, 2, …, and represent whole-number sums and differences within 100 on a number line diagram.',
     url: 'http://corestandards.org/Math/Content/2/MD/B/6'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.B.5',
     description: 'Use addition and subtraction within 100 to solve word problems involving lengths that are given in the same units, e.g., by using drawings (such as drawings of rulers) and equations with a symbol for the unknown number to represent the problem.',
     url: 'http://corestandards.org/Math/Content/2/MD/B/5'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.B',
     description: 'Relate addition and subtraction to length.',
     url: 'http://corestandards.org/Math/Content/2/MD/B'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.A.4',
     description: 'Measure to determine how much longer one object is than another, expressing the length difference in terms of a standard length unit.',
     url: 'http://corestandards.org/Math/Content/2/MD/A/4'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.A.3',
     description: 'Estimate lengths using units of inches, feet, centimeters, and meters.',
     url: 'http://corestandards.org/Math/Content/2/MD/A/3'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.A.2',
     description: 'Measure the length of an object twice, using length units of different lengths for the two measurements; describe how the two measurements relate to the size of the unit chosen.',
     url: 'http://corestandards.org/Math/Content/2/MD/A/2'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.A.1',
     description: 'Measure the length of an object by selecting and using appropriate tools such as rulers, yardsticks, meter sticks, and measuring tapes.',
     url: 'http://corestandards.org/Math/Content/2/MD/A/1'
   }, {
     identifier: 'CCSS.Math.Content.2.MD.A',
     description: 'Measure and estimate lengths in standard units.',
     url: 'http://corestandards.org/Math/Content/2/MD/A'
   }, {
     identifier: 'CCSS.Math.Content.2.MD',
     description: 'Measurement and Data',
     url: 'http://corestandards.org/Math/Content/2/MD'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.B.9',
     description: 'Explain why addition and subtraction strategies work, using place value and the properties of operations.',
     url: 'http://corestandards.org/Math/Content/2/NBT/B/9'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.B.8',
     description: 'Mentally add 10 or 100 to a given number 100—900, and mentally subtract 10 or 100 from a given number 100—900.',
     url: 'http://corestandards.org/Math/Content/2/NBT/B/8'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.B.7',
     description: 'Add and subtract within 1000, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method. Understand that in adding or subtracting three-digit numbers, one adds or subtracts hundreds and hundreds, tens and tens, ones and ones; and sometimes it is necessary to compose or decompose tens or hundreds.',
     url: 'http://corestandards.org/Math/Content/2/NBT/B/7'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.B.6',
     description: 'Add up to four two-digit numbers using strategies based on place value and properties of operations.',
     url: 'http://corestandards.org/Math/Content/2/NBT/B/6'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.B.5',
     description: 'Fluently add and subtract within 100 using strategies based on place value, properties of operations, and/or the relationship between addition and subtraction.',
     url: 'http://corestandards.org/Math/Content/2/NBT/B/5'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.B',
     description: 'Use place value understanding and properties of operations to add and subtract.',
     url: 'http://corestandards.org/Math/Content/2/NBT/B'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.A.4',
     description: 'Compare two three-digit numbers based on meanings of the hundreds, tens, and ones digits, using >, =, and < symbols to record the results of comparisons.',
     url: 'http://corestandards.org/Math/Content/2/NBT/A/4'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.A.3',
     description: 'Read and write numbers to 1000 using base-ten numerals, number names, and expanded form.',
     url: 'http://corestandards.org/Math/Content/2/NBT/A/3'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.A.2',
     description: 'Count within 1000; skip-count by 5s, 10s, and 100s.',
     url: 'http://corestandards.org/Math/Content/2/NBT/A/2'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.A.1b',
     description: 'The numbers 100, 200, 300, 400, 500, 600, 700, 800, 900 refer to one, two, three, four, five, six, seven, eight, or nine hundreds (and 0 tens and 0 ones).',
     url: 'http://corestandards.org/Math/Content/2/NBT/A/1/b'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.A.1a',
     description: '100 can be thought of as a bundle of ten tens — called a "hundred."',
     url: 'http://corestandards.org/Math/Content/2/NBT/A/1/a'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.A.1',
     description: 'Understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones; e.g., 706 equals 7 hundreds, 0 tens, and 6 ones. Understand the following as special cases:',
     url: 'http://corestandards.org/Math/Content/2/NBT/A/1'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT.A',
     description: 'Understand place value.',
     url: 'http://corestandards.org/Math/Content/2/NBT/A'
   }, {
     identifier: 'CCSS.Math.Content.2.NBT',
     description: 'Number and Operations in Base Ten',
     url: 'http://corestandards.org/Math/Content/2/NBT/'
   }, {
     identifier: 'CCSS.Math.Content.2.OA.C.4',
     description: 'Use addition to find the total number of objects arranged in rectangular arrays with up to 5 rows and up to 5 columns; write an equation to express the total as a sum of equal addends.',
     url: 'http://corestandards.org/Math/Content/2/OA/C/4'
   }, {
     identifier: 'CCSS.Math.Content.2.OA.C.3',
     description: 'Determine whether a group of objects (up to 20) has an odd or even number of members, e.g., by pairing objects or counting them by 2s; write an equation to express an even number as a sum of two equal addends.',
     url: 'http://corestandards.org/Math/Content/2/OA/C/3'
   }, {
     identifier: 'CCSS.Math.Content.2.OA.C',
     description: 'Work with equal groups of objects to gain foundations for multiplication.',
     url: 'http://corestandards.org/Math/Content/2/OA/C'
   }, {
     identifier: 'CCSS.Math.Content.2.OA.B.2',
     description: 'Fluently add and subtract within 20 using mental strategies. By end of Grade 2, know from memory all sums of two one-digit numbers.',
     url: 'http://corestandards.org/Math/Content/2/OA/B/2'
   }, {
     identifier: 'CCSS.Math.Content.2.OA.B',
     description: 'Add and subtract within 20.',
     url: 'http://corestandards.org/Math/Content/2/OA/B'
   }, {
     identifier: 'CCSS.Math.Content.2.OA.A.1',
     description: 'Use addition and subtraction within 100 to solve one- and two-step word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem.',
     url: 'http://corestandards.org/Math/Content/2/OA/A/1'
   }, {
     identifier: 'CCSS.Math.Content.2.OA.A',
     description: 'Represent and solve problems involving addition and subtraction.',
     url: 'http://corestandards.org/Math/Content/2/OA/A'
   }, {
     identifier: 'CCSS.Math.Content.2.OA',
     description: 'Operations and Algebraic Thinking',
     url: 'http://corestandards.org/Math/Content/2/OA/'
   },
];

var grade3 = [
  {
    identifier: 'CCSS.Math.Content.3.NF.A.3d',
    description: 'Compare two fractions with the same numerator or the same denominator by reasoning about their size. Recognize that comparisons are valid only when the two fractions refer to the same whole. Record the results of comparisons with the symbols >, =, or <, and justify the conclusions, e.g., by using a visual fraction model.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/3/d'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.3c',
    description: 'Express whole numbers as fractions, and recognize fractions that are equivalent to whole numbers.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/3/c'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.3b',
    description: 'Recognize and generate simple equivalent fractions, e.g., 1/2 = 2/4, 4/6 = 2/3). Explain why the fractions are equivalent, e.g., by using a visual fraction model.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/3/b'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.3a',
    description: 'Understand two fractions as equivalent (equal) if they are the same size, or the same point on a number line.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/3/a'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.3',
    description: 'Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.2b',
    description: 'Represent a fraction a/b on a number line diagram by marking off a lengths 1/b from 0. Recognize that the resulting interval has size a/b and that its endpoint locates the number a/b on the number line.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/2/b'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.2a',
    description: 'Represent a fraction 1/b on a number line diagram by defining the interval from 0 to 1 as the whole and partitioning it into b equal parts. Recognize that each part has size 1/b and that the endpoint of the part based at 0 locates the number 1/b on the number line.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/2/a'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.2',
    description: 'Understand a fraction as a number on the number line; represent fractions on a number line diagram.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.1',
    description: 'Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts; understand a fraction a/b as the quantity formed by a parts of size 1/b.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A',
    description: 'Develop understanding of fractions as numbers.',
    url: 'http://corestandards.org/Math/Content/3/NF/A'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF',
    description: 'Number and Operations—Fractions',
    url: 'http://corestandards.org/Math/Content/3/NF/'
  },
  {
    identifier: 'CCSS.Math.Content.3.G.A.2',
    description: 'Partition shapes into parts with equal areas. Express the area of each part as a unit fraction of the whole.',
    url: 'http://corestandards.org/Math/Content/3/G/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.3.G.A.1',
    description: 'Understand that shapes in different categories (e.g., rhombuses, rectangles, and others) may share attributes (e.g., having four sides), and that the shared attributes can define a larger category (e.g., quadrilaterals). Recognize rhombuses, rectangles, and squares as examples of quadrilaterals, and draw examples of quadrilaterals that do not belong to any of these subcategories.',
    url: 'http://corestandards.org/Math/Content/3/G/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.3.G.A',
    description: 'Reason with shapes and their attributes.',
    url: 'http://corestandards.org/Math/Content/3/G/A'
  },
  {
    identifier: 'CCSS.Math.Content.3.G',
    description: 'Geometry',
    url: 'http://corestandards.org/Math/Content/3/G/'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.D.8',
    description: 'Solve real world and mathematical problems involving perimeters of polygons, including finding the perimeter given the side lengths, finding an unknown side length, and exhibiting rectangles with the same perimeter and different areas or with the same area and different perimeters.',
    url: 'http://corestandards.org/Math/Content/3/MD/D/8'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.D',
    description: 'Geometric measurement: recognize perimeter as an attribute of plane figures and distinguish between linear and area measures.',
    url: 'http://corestandards.org/Math/Content/3/MD/D'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.7d',
    description: 'Recognize area as additive. Find areas of rectilinear figures by decomposing them into non-overlapping rectangles and adding the areas of the non-overlapping parts, applying this technique to solve real world problems.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/7/d'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.7c',
    description: 'Use tiling to show in a concrete case that the area of a rectangle with whole-number side lengths a and b + c is the sum of a × b and a × c. Use area models to represent the distributive property in mathematical reasoning.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/7/c'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.7b',
    description: 'Multiply side lengths to find areas of rectangles with whole-number side lengths in the context of solving real world and mathematical problems, and represent whole-number products as rectangular areas in mathematical reasoning.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/7/b'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.7a',
    description: 'Find the area of a rectangle with whole-number side lengths by tiling it, and show that the area is the same as would be found by multiplying the side lengths.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/7/a'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.7',
    description: 'Relate area to the operations of multiplication and addition.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.6',
    description: 'Measure areas by counting unit squares (square cm, square m, square in, square ft, and improvised units).',
    url: 'http://corestandards.org/Math/Content/3/MD/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.5b',
    description: 'A plane figure which can be covered without gaps or overlaps by n unit squares is said to have an area of n square units.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/5/b'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.5a',
    description: 'A square with side length 1 unit, called "a unit square," is said to have "one square unit" of area, and can be used to measure area.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/5/a'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.5',
    description: 'Recognize area as an attribute of plane figures and understand concepts of area measurement.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/5'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C',
    description: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition.',
    url: 'http://corestandards.org/Math/Content/3/MD/C'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.B.4',
    description: 'Generate measurement data by measuring lengths using rulers marked with halves and fourths of an inch. Show the data by making a line plot, where the horizontal scale is marked off in appropriate units— whole numbers, halves, or quarters.',
    url: 'http://corestandards.org/Math/Content/3/MD/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.B.3',
    description: 'Draw a scaled picture graph and a scaled bar graph to represent a data set with several categories. Solve one- and two-step "how many more" and "how many less" problems using information presented in scaled bar graphs.',
    url: 'http://corestandards.org/Math/Content/3/MD/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.B',
    description: 'Represent and interpret data.',
    url: 'http://corestandards.org/Math/Content/3/MD/B'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.A.2',
    description: 'Measure and estimate liquid volumes and masses of objects using standard units of grams (g), kilograms (kg), and liters (l). Add, subtract, multiply, or divide to solve one-step word problems involving masses or volumes that are given in the same units, e.g., by using drawings (such as a beaker with a measurement scale) to represent the problem.',
    url: 'http://corestandards.org/Math/Content/3/MD/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.A.1',
    description: 'Tell and write time to the nearest minute and measure time intervals in minutes. Solve word problems involving addition and subtraction of time intervals in minutes, e.g., by representing the problem on a number line diagram.',
    url: 'http://corestandards.org/Math/Content/3/MD/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.A',
    description: 'Solve problems involving measurement and estimation of intervals of time, liquid volumes, and masses of objects.',
    url: 'http://corestandards.org/Math/Content/3/MD/A'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD',
    description: 'Measurement and Data',
    url: 'http://corestandards.org/Math/Content/3/MD/'
  },
  {
    identifier: 'CCSS.Math.Content.3.NBT.A.3',
    description: 'Multiply one-digit whole numbers by multiples of 10 in the range 10—90 (e.g., 9 × 80, 5 × 60) using strategies based on place value and properties of operations.',
    url: 'http://corestandards.org/Math/Content/3/NBT/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.3.NBT.A.2',
    description: 'Fluently add and subtract within 1000 using strategies and algorithms based on place value, properties of operations, and/or the relationship between addition and subtraction.',
    url: 'http://corestandards.org/Math/Content/3/NBT/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.3.NBT.A.1',
    description: 'Use place value understanding to round whole numbers to the nearest 10 or 100.',
    url: 'http://corestandards.org/Math/Content/3/NBT/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.3.NBT.A',
    description: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.',
    url: 'http://corestandards.org/Math/Content/3/NBT/A'
  },
  {
    identifier: 'CCSS.Math.Content.3.NBT',
    description: 'Number and Operations in Base Ten',
    url: 'http://corestandards.org/Math/Content/3/NBT/'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.D.9',
    description: 'Identify arithmetic patterns (including patterns in the addition table or multiplication table), and explain them using properties of operations.',
    url: 'http://corestandards.org/Math/Content/3/OA/D/9'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.D.8',
    description: 'Solve two-step word problems using the four operations. Represent these problems using equations with a letter standing for the unknown quantity. Assess the reasonableness of answers using mental computation and estimation strategies including rounding.',
    url: 'http://corestandards.org/Math/Content/3/OA/D/8'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.D',
    description: 'Solve problems involving the four operations, and identify and explain patterns in arithmetic.',
    url: 'http://corestandards.org/Math/Content/3/OA/D'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.C.7',
    description: 'Fluently multiply and divide within 100, using strategies such as the relationship between multiplication and division (e.g., knowing that 8 × 5 = 40, one knows 40 ÷ 5 = 8) or properties of operations. By the end of Grade 3, know from memory all products of two one-digit numbers.',
    url: 'http://corestandards.org/Math/Content/3/OA/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.C',
    description: 'Multiply and divide within 100.',
    url: 'http://corestandards.org/Math/Content/3/OA/C'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.B.6',
    description: 'Understand division as an unknown-factor problem.',
    url: 'http://corestandards.org/Math/Content/3/OA/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.B.5',
    description: 'Apply properties of operations as strategies to multiply and divide.',
    url: 'http://corestandards.org/Math/Content/3/OA/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.B',
    description: 'Understand properties of multiplication and the relationship between multiplication and division.',
    url: 'http://corestandards.org/Math/Content/3/OA/B'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.A.4',
    description: 'Determine the unknown whole number in a multiplication or division equation relating three whole numbers.',
    url: 'http://corestandards.org/Math/Content/3/OA/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.A.3',
    description: 'Use multiplication and division within 100 to solve word problems in situations involving equal groups, arrays, and measurement quantities, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem.',
    url: 'http://corestandards.org/Math/Content/3/OA/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.A.2',
    description: 'Interpret whole-number quotients of whole numbers, e.g., interpret 56 ÷ 8 as the number of objects in each share when 56 objects are partitioned equally into 8 shares, or as a number of shares when 56 objects are partitioned into equal shares of 8 objects each.',
    url: 'http://corestandards.org/Math/Content/3/OA/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.A.1',
    description: 'Interpret products of whole numbers, e.g., interpret 5 × 7 as the total number of objects in 5 groups of 7 objects each.',
    url: 'http://corestandards.org/Math/Content/3/OA/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA.A',
    description: 'Represent and solve problems involving multiplication and division.',
    url: 'http://corestandards.org/Math/Content/3/OA/A'
  },
  {
    identifier: 'CCSS.Math.Content.3.OA',
    description: 'Operations and Algebraic Thinking',
    url: 'http://corestandards.org/Math/Content/3/OA/'
  }
];

var grade4 = [
  {
    identifier: 'CCSS.Math.Content.4.NF.C.7',
    description: 'Compare two decimals to hundredths by reasoning about their size. Recognize that comparisons are valid only when the two decimals refer to the same whole. Record the results of comparisons with the symbols >, =, or <, and justify the conclusions, e.g., by using a visual model.',
    url: 'http://corestandards.org/Math/Content/4/NF/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.C.6',
    description: 'Use decimal notation for fractions with denominators 10 or 100.',
    url: 'http://corestandards.org/Math/Content/4/NF/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.C.5',
    description: 'Express a fraction with denominator 10 as an equivalent fraction with denominator 100, and use this technique to add two fractions with respective denominators 10 and 100.',
    url: 'http://corestandards.org/Math/Content/4/NF/C/5'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.C',
    description: 'Understand decimal notation for fractions, and compare decimal fractions.',
    url: 'http://corestandards.org/Math/Content/4/NF/C'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.4c',
    description: 'Solve word problems involving multiplication of a fraction by a whole number, e.g., by using visual fraction models and equations to represent the problem.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/4/c'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.4b',
    description: 'Understand a multiple of a/b as a multiple of 1/b, and use this understanding to multiply a fraction by a whole number.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/4/b'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.4a',
    description: 'Understand a fraction a/b as a multiple of 1/b.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/4/a'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.4',
    description: 'Apply and extend previous understandings of multiplication to multiply a fraction by a whole number.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.3d',
    description: 'Solve word problems involving addition and subtraction of fractions referring to the same whole and having like denominators, e.g., by using visual fraction models and equations to represent the problem.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/3/d'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.3c',
    description: 'Add and subtract mixed numbers with like denominators, e.g., by replacing each mixed number with an equivalent fraction, and/or by using properties of operations and the relationship between addition and subtraction.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/3/c'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.3b',
    description: 'Decompose a fraction into a sum of fractions with the same denominator in more than one way, recording each decomposition by an equation. Justify decompositions, e.g., by using a visual fraction model.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/3/b'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.3a',
    description: 'Understand addition and subtraction of fractions as joining and separating parts referring to the same whole.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/3/a'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.3',
    description: 'Understand a fraction a/b with a > 1 as a sum of fractions 1/b.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B',
    description: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.',
    url: 'http://corestandards.org/Math/Content/4/NF/B'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.A.2',
    description: 'Compare two fractions with different numerators and different denominators, e.g., by creating common denominators or numerators, or by comparing to a benchmark fraction such as 1/2. Recognize that comparisons are valid only when the two fractions refer to the same whole. Record the results of comparisons with symbols >, =, or <, and justify the conclusions, e.g., by using a visual fraction model.',
    url: 'http://corestandards.org/Math/Content/4/NF/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.A.1',
    description: 'Explain why a fraction a/b is equivalent to a fraction (n × a)/(n × b) by using visual fraction models, with attention to how the number and size of the parts differ even though the two fractions themselves are the same size. Use this principle to recognize and generate equivalent fractions.',
    url: 'http://corestandards.org/Math/Content/4/NF/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.A',
    description: 'Extend understanding of fraction equivalence and ordering.',
    url: 'http://corestandards.org/Math/Content/4/NF/A'
  },
  {
    identifier: undefined,
    description: 'Number and Operations—Fractions',
    url: 'phil add url!'
  },
  {
    identifier: 'CCSS.Math.Content.4.G.A.3',
    description: 'Recognize a line of symmetry for a two-dimensional figure as a line across the figure such that the figure can be folded along the line into matching parts. Identify line-symmetric figures and draw lines of symmetry.',
    url: 'http://corestandards.org/Math/Content/4/G/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.4.G.A.2',
    description: 'Classify two-dimensional figures based on the presence or absence of parallel or perpendicular lines, or the presence or absence of angles of a specified size. Recognize right triangles as a category, and identify right triangles.',
    url: 'http://corestandards.org/Math/Content/4/G/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.4.G.A.1',
    description: 'Draw points, lines, line segments, rays, angles (right, acute, obtuse), and perpendicular and parallel lines. Identify these in two-dimensional figures.',
    url: 'http://corestandards.org/Math/Content/4/G/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.4.G.A',
    description: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles.',
    url: 'http://corestandards.org/Math/Content/4/G/A'
  },
  {
    identifier: undefined,
    description: 'Geometry',
    url: 'phil add url!'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.C.7',
    description: 'Recognize angle measure as additive. When an angle is decomposed into non-overlapping parts, the angle measure of the whole is the sum of the angle measures of the parts. Solve addition and subtraction problems to find unknown angles on a diagram in real world and mathematical problems, e.g., by using an equation with a symbol for the unknown angle measure.',
    url: 'http://corestandards.org/Math/Content/4/MD/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.C.6',
    description: 'Measure angles in whole-number degrees using a protractor. Sketch angles of specified measure.',
    url: 'http://corestandards.org/Math/Content/4/MD/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.C.5b',
    description: 'An angle that turns through n one-degree angles is said to have an angle measure of n degrees.',
    url: 'http://corestandards.org/Math/Content/4/MD/C/5/b'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.C.5a',
    description: 'An angle is measured with reference to a circle with its center at the common endpoint of the rays, by considering the fraction of the circular arc between the points where the two rays intersect the circle. An angle that turns through 1/360 of a circle is called a "one-degree angle," and can be used to measure angles.',
    url: 'http://corestandards.org/Math/Content/4/MD/C/5/a'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.C.5',
    description: 'Recognize angles as geometric shapes that are formed wherever two rays share a common endpoint, and understand concepts of angle measurement:',
    url: 'http://corestandards.org/Math/Content/4/MD/C/5'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.C',
    description: 'Geometric measurement: understand concepts of angle and measure angles.',
    url: 'http://corestandards.org/Math/Content/4/MD/C'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.B.4',
    description: 'Make a line plot to display a data set of measurements in fractions of a unit (1/2, 1/4, 1/8). Solve problems involving addition and subtraction of fractions by using information presented in line plots.',
    url: 'http://corestandards.org/Math/Content/4/MD/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.B',
    description: 'Represent and interpret data.',
    url: 'http://corestandards.org/Math/Content/4/MD/B'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.A.3',
    description: 'Apply the area and perimeter formulas for rectangles in real world and mathematical problems.',
    url: 'http://corestandards.org/Math/Content/4/MD/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.A.2',
    description: 'Use the four operations to solve word problems involving distances, intervals of time, liquid volumes, masses of objects, and money, including problems involving simple fractions or decimals, and problems that require expressing measurements given in a larger unit in terms of a smaller unit. Represent measurement quantities using diagrams such as number line diagrams that feature a measurement scale.',
    url: 'http://corestandards.org/Math/Content/4/MD/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.A.1',
    description: 'Know relative sizes of measurement units within one system of units including km, m, cm; kg, g; lb, oz.; l, ml; hr, min, sec. Within a single system of measurement, express measurements in a larger unit in terms of a smaller unit. Record measurement equivalents in a two column table.',
    url: 'http://corestandards.org/Math/Content/4/MD/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.A',
    description: 'Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit.',
    url: 'http://corestandards.org/Math/Content/4/MD/A'
  },
  {
    identifier: undefined,
    description: 'Measurement and Data',
    url: 'phil add url!'
  },
  {
    identifier: 'CCSS.Math.Content.4.NBT.B.6',
    description: 'Find whole-number quotients and remainders with up to four-digit dividends and one-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models.',
    url: 'http://corestandards.org/Math/Content/4/NBT/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.4.NBT.B.5',
    description: 'Multiply a whole number of up to four digits by a one-digit whole number, and multiply two two-digit numbers, using strategies based on place value and the properties of operations. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models.',
    url: 'http://corestandards.org/Math/Content/4/NBT/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.4.NBT.B.4',
    description: 'Fluently add and subtract multi-digit whole numbers using the standard algorithm.',
    url: 'http://corestandards.org/Math/Content/4/NBT/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.4.NBT.B',
    description: 'Use place value understanding and properties of operations to perform multi-digit arithmetic.',
    url: 'http://corestandards.org/Math/Content/4/NBT/B'
  },
  {
    identifier: 'CCSS.Math.Content.4.NBT.A.3',
    description: 'Use place value understanding to round multi-digit whole numbers to any place.',
    url: 'http://corestandards.org/Math/Content/4/NBT/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.4.NBT.A.2',
    description: 'Read and write multi-digit whole numbers using base-ten numerals, number names, and expanded form. Compare two multi-digit numbers based on meanings of the digits in each place, using >, =, and < symbols to record the results of comparisons.',
    url: 'http://corestandards.org/Math/Content/4/NBT/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.4.NBT.A.1',
    description: 'Recognize that in a multi-digit whole number, a digit in one place represents ten times what it represents in the place to its right.',
    url: 'http://corestandards.org/Math/Content/4/NBT/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.4.NBT.A',
    description: 'Generalize place value understanding for multi-digit whole numbers.',
    url: 'http://corestandards.org/Math/Content/4/NBT/A'
  },
  {
    identifier: undefined,
    description: 'Number and Operations in Base Ten',
    url: 'phil add url!'
  },
  {
    identifier: 'CCSS.Math.Content.4.OA.C.5',
    description: 'Generate a number or shape pattern that follows a given rule. Identify apparent features of the pattern that were not explicit in the rule itself.',
    url: 'http://corestandards.org/Math/Content/4/OA/C/5'
  },
  {
    identifier: 'CCSS.Math.Content.4.OA.C',
    description: 'Generate and analyze patterns.',
    url: 'http://corestandards.org/Math/Content/4/OA/C'
  },
  {
    identifier: 'CCSS.Math.Content.4.OA.B.4',
    description: 'Find all factor pairs for a whole number in the range 1—100. Recognize that a whole number is a multiple of each of its factors. Determine whether a given whole number in the range 1—100 is a multiple of a given one-digit number. Determine whether a given whole number in the range 1—100 is prime or composite.',
    url: 'http://corestandards.org/Math/Content/4/OA/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.4.OA.B',
    description: 'Gain familiarity with factors and multiples.',
    url: 'http://corestandards.org/Math/Content/4/OA/B'
  },
  {
    identifier: 'CCSS.Math.Content.4.OA.A.3',
    description: 'Solve multistep word problems posed with whole numbers and having whole-number answers using the four operations, including problems in which remainders must be interpreted. Represent these problems using equations with a letter standing for the unknown quantity. Assess the reasonableness of answers using mental computation and estimation strategies including rounding.',
    url: 'http://corestandards.org/Math/Content/4/OA/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.4.OA.A.2',
    description: 'Multiply or divide to solve word problems involving multiplicative comparison, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem, distinguishing multiplicative comparison from additive comparison.',
    url: 'http://corestandards.org/Math/Content/4/OA/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.4.OA.A.1',
    description: 'Interpret a multiplication equation as a comparison, e.g., interpret 35 = 5 × 7 as a statement that 35 is 5 times as many as 7 and 7 times as many as 5. Represent verbal statements of multiplicative comparisons as multiplication equations.',
    url: 'http://corestandards.org/Math/Content/4/OA/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.4.OA.A',
    description: 'Use the four operations with whole numbers to solve problems.',
    url: 'http://corestandards.org/Math/Content/4/OA/A'
  },
  {
    identifier: undefined,
    description: 'Operations and Algebraic Thinking',
    url: 'phil add url!'
  },
  {
    identifier: 'CCSS.Math.Practice.MP8',
    description: 'Look for and express regularity in repeated reasoning.',
    url: 'http://corestandards.org/Math/Practice/MP8'
  },
  {
    identifier: 'CCSS.Math.Practice.MP7',
    description: 'Look for and make use of structure.',
    url: 'http://corestandards.org/Math/Practice/MP7'
  },
  {
    identifier: 'CCSS.Math.Practice.MP6',
    description: 'Attend to precision.',
    url: 'http://corestandards.org/Math/Practice/MP6'
  },
  {
    identifier: 'CCSS.Math.Practice.MP5',
    description: 'Use appropriate tools strategically.',
    url: 'http://corestandards.org/Math/Practice/MP5'
  },
  {
    identifier: 'CCSS.Math.Practice.MP4',
    description: 'Model with mathematics.',
    url: 'http://corestandards.org/Math/Practice/MP4'
  },
  {
    identifier: 'CCSS.Math.Practice.MP3',
    description: 'Construct viable arguments and critique the reasoning of others.',
    url: 'http://corestandards.org/Math/Practice/MP3'
  },
  {
    identifier: 'CCSS.Math.Practice.MP2',
    description: 'Reason abstractly and quantitatively.',
    url: 'http://corestandards.org/Math/Practice/MP2'
  },
  {
    identifier: 'CCSS.Math.Practice.MP1',
    description: 'Make sense of problems and persevere in solving them.',
    url: 'http://corestandards.org/Math/Practice/MP1'
  },
  {
    identifier: undefined,
    description: 'Standards for Mathematical Practice',
    url: 'phil add url!'
  }
];

// var grade5 = [];

// var grade6 = [];

// var grade7 = [];

// var grade8 = [];

// var grade9 = [];


var data = gradek.concat(grade1, grade2, grade3, grade4, grade5, grade6, grade7, grade8, grade9);

var CategoriesSeeder = Seeder.extend({
  shouldRun: function () {
    return Category.count().exec().then(count => count === 0);
  },
  run: function () {
    return Category.create(data);
  }
});

module.exports = CategoriesSeeder;
