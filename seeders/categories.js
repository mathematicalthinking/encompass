var _ = require('underscore');
const { ObjectId } = require('./utils');

// var Seeder = require('mongoose-data-seed').Seeder;
// var Category = require('../server/datasource/schemas').Category;

var gradek = [{
    _id: ObjectId('5bb650e1fefbf3cf9e88f673'),
    identifier: 'CCSS.Math.Content.K',
    description: 'Grade K',
    url: 'http://corestandards.org/Math/Content/K'
  },
  {
    _id: ObjectId('5bb650e1fefbf3cf9e88f677'),
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
    identifier: 'CCSS.Math.Content.K.CC.B.4.c',
    description: 'Understand that each successive number name refers to a quantity that is one larger.',
    url: 'http://corestandards.org/Math/Content/K/CC/B/4/c'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.B.4.b',
    description: 'Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted.',
    url: 'http://corestandards.org/Math/Content/K/CC/B/4/b'
  },
  {
    identifier: 'CCSS.Math.Content.K.CC.B.4.a',
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
];

var grade1 = [{
    _id: ObjectId('5be48d3b9f4e39142bd3f0d2'),
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
    _id: ObjectId('5bb650e1fefbf3cf9e88f832'),
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
    identifier: 'CCSS.Math.Content.1.NBT.B.2.c',
    description: 'The numbers 10, 20, 30, 40, 50, 60, 70, 80, 90 refer to one, two, three, four, five, six, seven, eight, or nine tens (and 0 ones).',
    url: 'http://corestandards.org/Math/Content/1/NBT/B/2/c'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.B.2.b',
    description: 'The numbers from 11 to 19 are composed of a ten and one, two, three, four, five, six, seven, eight, or nine ones.',
    url: 'http://corestandards.org/Math/Content/1/NBT/B/2/b'
  },
  {
    identifier: 'CCSS.Math.Content.1.NBT.B.2.a',
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
  }
];

var grade2 = [
  {
    identifier: 'CCSS.Math.Content.2',
    description: 'Grade 2',
    url: 'http://corestandards.org/Math/Content/2'
  },
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
    identifier: 'CCSS.Math.Content.2.NBT.A.1.b',
    description: 'The numbers 100, 200, 300, 400, 500, 600, 700, 800, 900 refer to one, two, three, four, five, six, seven, eight, or nine hundreds (and 0 tens and 0 ones).',
    url: 'http://corestandards.org/Math/Content/2/NBT/A/1/b'
  }, {
    identifier: 'CCSS.Math.Content.2.NBT.A.1.a',
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
    identifier: 'CCSS.Math.Content.3',
    description: 'Grade 3',
    url: 'http://corestandards.org/Math/Content/3'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.3.d',
    description: 'Compare two fractions with the same numerator or the same denominator by reasoning about their size. Recognize that comparisons are valid only when the two fractions refer to the same whole. Record the results of comparisons with the symbols >, =, or <, and justify the conclusions, e.g., by using a visual fraction model.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/3/d'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.3.c',
    description: 'Express whole numbers as fractions, and recognize fractions that are equivalent to whole numbers.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/3/c'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.3.b',
    description: 'Recognize and generate simple equivalent fractions, e.g., 1/2 = 2/4, 4/6 = 2/3). Explain why the fractions are equivalent, e.g., by using a visual fraction model.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/3/b'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.3.a',
    description: 'Understand two fractions as equivalent (equal) if they are the same size, or the same point on a number line.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/3/a'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.3',
    description: 'Explain equivalence of fractions in special cases, and compare fractions by reasoning about their size.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.2.b',
    description: 'Represent a fraction a/b on a number line diagram by marking off a lengths 1/b from 0. Recognize that the resulting interval has size a/b and that its endpoint locates the number a/b on the number line.',
    url: 'http://corestandards.org/Math/Content/3/NF/A/2/b'
  },
  {
    identifier: 'CCSS.Math.Content.3.NF.A.2.a',
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
    identifier: 'CCSS.Math.Content.3.MD.C.7.d',
    description: 'Recognize area as additive. Find areas of rectilinear figures by decomposing them into non-overlapping rectangles and adding the areas of the non-overlapping parts, applying this technique to solve real world problems.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/7/d'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.7.c',
    description: 'Use tiling to show in a concrete case that the area of a rectangle with whole-number side lengths a and b + c is the sum of a × b and a × c. Use area models to represent the distributive property in mathematical reasoning.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/7/c'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.7.b',
    description: 'Multiply side lengths to find areas of rectangles with whole-number side lengths in the context of solving real world and mathematical problems, and represent whole-number products as rectangular areas in mathematical reasoning.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/7/b'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.7.a',
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
    identifier: 'CCSS.Math.Content.3.MD.C.5.b',
    description: 'A plane figure which can be covered without gaps or overlaps by n unit squares is said to have an area of n square units.',
    url: 'http://corestandards.org/Math/Content/3/MD/C/5/b'
  },
  {
    identifier: 'CCSS.Math.Content.3.MD.C.5.a',
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
    identifier: 'CCSS.Math.Content.4',
    description: 'Grade 4',
    url: 'http://corestandards.org/Math/Content/4'
  },
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
    identifier: 'CCSS.Math.Content.4.NF.B.4.c',
    description: 'Solve word problems involving multiplication of a fraction by a whole number, e.g., by using visual fraction models and equations to represent the problem.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/4/c'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.4.b',
    description: 'Understand a multiple of a/b as a multiple of 1/b, and use this understanding to multiply a fraction by a whole number.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/4/b'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.4.a',
    description: 'Understand a fraction a/b as a multiple of 1/b.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/4/a'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.4',
    description: 'Apply and extend previous understandings of multiplication to multiply a fraction by a whole number.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.3.d',
    description: 'Solve word problems involving addition and subtraction of fractions referring to the same whole and having like denominators, e.g., by using visual fraction models and equations to represent the problem.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/3/d'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.3.c',
    description: 'Add and subtract mixed numbers with like denominators, e.g., by replacing each mixed number with an equivalent fraction, and/or by using properties of operations and the relationship between addition and subtraction.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/3/c'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.3.b',
    description: 'Decompose a fraction into a sum of fractions with the same denominator in more than one way, recording each decomposition by an equation. Justify decompositions, e.g., by using a visual fraction model.',
    url: 'http://corestandards.org/Math/Content/4/NF/B/3/b'
  },
  {
    identifier: 'CCSS.Math.Content.4.NF.B.3.a',
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
    identifier: 'CCSS.Math.Content.4.NF',
    description: 'Number and Operations—Fractions',
    url: 'http://corestandards.org/Math/Content/4/NF/'
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
    identifier: 'CCSS.Math.Content.4.G',
    description: 'Geometry',
    url: 'http://corestandards.org/Math/Content/4/G/'
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
    identifier: 'CCSS.Math.Content.4.MD.C.5.b',
    description: 'An angle that turns through n one-degree angles is said to have an angle measure of n degrees.',
    url: 'http://corestandards.org/Math/Content/4/MD/C/5/b'
  },
  {
    identifier: 'CCSS.Math.Content.4.MD.C.5.a',
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
    identifier: 'CCSS.Math.Content.4.MD',
    description: 'Measurement and Data',
    url: 'http://corestandards.org/Math/Content/4/MD/'
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
    identifier: 'CCSS.Math.Content.4.NBT',
    description: 'Number and Operations in Base Ten',
    url: 'http://corestandards.org/Math/Content/4/NBT/'
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
    identifier: 'CCSS.Math.Content.4.OA',
    description: 'Operations and Algebraic Thinking',
    url: 'http://corestandards.org/Math/Content/4/OA/'
  },
];

var grade5 = [
  {
    identifier: 'CCSS.Math.Content.5',
    description: 'Grade 5',
    url: 'http://corestandards.org/Math/Content/5'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.7.c',
    description: 'Solve real world problems involving division of unit fractions by non-zero whole numbers and division of whole numbers by unit fractions, e.g., by using visual fraction models and equations to represent the problem.',
    url: 'http://corestandards.org/Math/Content/5/NF/B/7/c'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.7.b',
    description: 'Interpret division of a whole number by a unit fraction, and compute such quotients.',
    url: 'http://corestandards.org/Math/Content/5/NF/B/7/b'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.7.a',
    description: 'Interpret division of a unit fraction by a non-zero whole number, and compute such quotients.',
    url: 'http://corestandards.org/Math/Content/5/NF/B/7/a'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.7',
    description: 'Apply and extend previous understandings of division to divide unit fractions by whole numbers and whole numbers by unit fractions.',
    url: 'http://corestandards.org/Math/Content/5/NF/B/7'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.6',
    description: 'Solve real world problems involving multiplication of fractions and mixed numbers, e.g., by using visual fraction models or equations to represent the problem.',
    url: 'http://corestandards.org/Math/Content/5/NF/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.5.b',
    description: 'Explaining why multiplying a given number by a fraction greater than 1 results in a product greater than the given number (recognizing multiplication by whole numbers greater than 1 as a familiar case); explaining why multiplying a given number by a fraction less than 1 results in a product smaller than the given number; and relating the principle of fraction equivalence a/b = (n×a)/(n×b) to the effect of multiplying a/b by 1.',
    url: 'http://corestandards.org/Math/Content/5/NF/B/5/b'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.5.a',
    description: 'Comparing the size of a product to the size of one factor on the basis of the size of the other factor, without performing the indicated multiplication.',
    url: 'http://corestandards.org/Math/Content/5/NF/B/5/a'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.5',
    description: 'Interpret multiplication as scaling (resizing), by:',
    url: 'http://corestandards.org/Math/Content/5/NF/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.4.b',
    description: 'Find the area of a rectangle with fractional side lengths by tiling it with unit squares of the appropriate unit fraction side lengths, and show that the area is the same as would be found by multiplying the side lengths. Multiply fractional side lengths to find areas of rectangles, and represent fraction products as rectangular areas.',
    url: 'http://corestandards.org/Math/Content/5/NF/B/4/b'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.4.a',
    description: 'Interpret the product (a/b) × q as a parts of a partition of q into b equal parts; equivalently, as the result of a sequence of operations a × q ÷ b.',
    url: 'http://corestandards.org/Math/Content/5/NF/B/4/a'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.4',
    description: 'Apply and extend previous understandings of multiplication to multiply a fraction or whole number by a fraction.',
    url: 'http://corestandards.org/Math/Content/5/NF/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B.3',
    description: 'Interpret a fraction as division of the numerator by the denominator (a/b = a ÷ b). Solve word problems involving division of whole numbers leading to answers in the form of fractions or mixed numbers, e.g., by using visual fraction models or equations to represent the problem.',
    url: 'http://corestandards.org/Math/Content/5/NF/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.B',
    description: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions.',
    url: 'http://corestandards.org/Math/Content/5/NF/B'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.A.2',
    description: 'Solve word problems involving addition and subtraction of fractions referring to the same whole, including cases of unlike denominators, e.g., by using visual fraction models or equations to represent the problem. Use benchmark fractions and number sense of fractions to estimate mentally and assess the reasonableness of answers.',
    url: 'http://corestandards.org/Math/Content/5/NF/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.A.1',
    description: 'Add and subtract fractions with unlike denominators (including mixed numbers) by replacing given fractions with equivalent fractions in such a way as to produce an equivalent sum or difference of fractions with like denominators.',
    url: 'http://corestandards.org/Math/Content/5/NF/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF.A',
    description: 'Use equivalent fractions as a strategy to add and subtract fractions.',
    url: 'http://corestandards.org/Math/Content/5/NF/A'
  },
  {
    identifier: 'CCSS.Math.Content.5.NF',
    description: 'Number and Operations—Fractions',
    url: 'http://corestandards.org/Math/Content/5/NF/'
  },
  {
    identifier: 'CCSS.Math.Content.5.G.B.4',
    description: 'Classify two-dimensional figures in a hierarchy based on properties.',
    url: 'http://corestandards.org/Math/Content/5/G/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.5.G.B.3',
    description: 'Understand that attributes belonging to a category of two-dimensional figures also belong to all subcategories of that category.',
    url: 'http://corestandards.org/Math/Content/5/G/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.5.G.B',
    description: 'Classify two-dimensional figures into categories based on their properties.',
    url: 'http://corestandards.org/Math/Content/5/G/B'
  },
  {
    identifier: 'CCSS.Math.Content.5.G.A.2',
    description: 'Represent real world and mathematical problems by graphing points in the first quadrant of the coordinate plane, and interpret coordinate values of points in the context of the situation.',
    url: 'http://corestandards.org/Math/Content/5/G/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.5.G.A.1',
    description: 'Use a pair of perpendicular number lines, called axes, to define a coordinate system, with the intersection of the lines (the origin) arranged to coincide with the 0 on each line and a given point in the plane located by using an ordered pair of numbers, called its coordinates. Understand that the first number indicates how far to travel from the origin in the direction of one axis, and the second number indicates how far to travel in the direction of the second axis, with the convention that the names of the two axes and the coordinates correspond (e.g., x-axis and x-coordinate, y-axis and y-coordinate).',
    url: 'http://corestandards.org/Math/Content/5/G/A/1'
  },
  {
    _id: ObjectId('5bb650e1fefbf3cf9e88f904'),
    identifier: 'CCSS.Math.Content.5.G.A',
    description: 'Graph points on the coordinate plane to solve real-world and mathematical problems.',
    url: 'http://corestandards.org/Math/Content/5/G/A'
  },
  {
    identifier: 'CCSS.Math.Content.5.G',
    description: 'Geometry',
    url: 'http://corestandards.org/Math/Content/5/G/'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.C.5.c',
    description: 'Recognize volume as additive. Find volumes of solid figures composed of two non-overlapping right rectangular prisms by adding the volumes of the non-overlapping parts, applying this technique to solve real world problems.',
    url: 'http://corestandards.org/Math/Content/5/MD/C/5/c'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.C.5.b',
    description: 'Apply the formulas V = l × w × h and V = b × h for rectangular prisms to find volumes of right rectangular prisms with whole-number edge lengths in the context of solving real world and mathematical problems.',
    url: 'http://corestandards.org/Math/Content/5/MD/C/5/b'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.C.5.a',
    description: 'Find the volume of a right rectangular prism with whole-number side lengths by packing it with unit cubes, and show that the volume is the same as would be found by multiplying the edge lengths, equivalently by multiplying the height by the area of the base. Represent threefold whole-number products as volumes, e.g., to represent the associative property of multiplication.',
    url: 'http://corestandards.org/Math/Content/5/MD/C/5/a'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.C.5',
    description: 'Relate volume to the operations of multiplication and addition and solve real world and mathematical problems involving volume.',
    url: 'http://corestandards.org/Math/Content/5/MD/C/5'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.C.4',
    description: 'Measure volumes by counting unit cubes, using cubic cm, cubic in, cubic ft, and improvised units.',
    url: 'http://corestandards.org/Math/Content/5/MD/C/4'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.C.3.b',
    description: 'A solid figure which can be packed without gaps or overlaps using n unit cubes is said to have a volume of n cubic units.',
    url: 'http://corestandards.org/Math/Content/5/MD/C/3/b'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.C.3.a',
    description: 'A cube with side length 1 unit, called a "unit cube," is said to have "one cubic unit" of volume, and can be used to measure volume.',
    url: 'http://corestandards.org/Math/Content/5/MD/C/3/a'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.C.3',
    description: 'Recognize volume as an attribute of solid figures and understand concepts of volume measurement.',
    url: 'http://corestandards.org/Math/Content/5/MD/C/3'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.C',
    description: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.',
    url: 'http://corestandards.org/Math/Content/5/MD/C'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.B.2',
    description: 'Make a line plot to display a data set of measurements in fractions of a unit (1/2, 1/4, 1/8). Use operations on fractions for this grade to solve problems involving information presented in line plots.',
    url: 'http://corestandards.org/Math/Content/5/MD/B/2'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.B',
    description: 'Represent and interpret data.',
    url: 'http://corestandards.org/Math/Content/5/MD/B'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.A.1',
    description: 'Convert among different-sized standard measurement units within a given measurement system (e.g., convert 5 cm to 0.05 m), and use these conversions in solving multi-step, real world problems.',
    url: 'http://corestandards.org/Math/Content/5/MD/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD.A',
    description: 'Convert like measurement units within a given measurement system.',
    url: 'http://corestandards.org/Math/Content/5/MD/A'
  },
  {
    identifier: 'CCSS.Math.Content.5.MD',
    description: 'Measurement and Data',
    url: 'http://corestandards.org/Math/Content/5/MD'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT.B.7',
    description: 'Add, subtract, multiply, and divide decimals to hundredths, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used.',
    url: 'http://corestandards.org/Math/Content/5/NBT/B/7'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT.B.6',
    description: 'Find whole-number quotients of whole numbers with up to four-digit dividends and two-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division. Illustrate and explain the calculation by using equations, rectangular arrays, and/or area models.',
    url: 'http://corestandards.org/Math/Content/5/NBT/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT.B.5',
    description: 'Fluently multiply multi-digit whole numbers using the standard algorithm.',
    url: 'http://corestandards.org/Math/Content/5/NBT/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT.B',
    description: 'Perform operations with multi-digit whole numbers and with decimals to hundredths.',
    url: 'http://corestandards.org/Math/Content/5/NBT/B'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT.A.4',
    description: 'Use place value understanding to round decimals to any place.',
    url: 'http://corestandards.org/Math/Content/5/NBT/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT.A.3.b',
    description: 'Compare two decimals to thousandths based on meanings of the digits in each place, using >, =, and < symbols to record the results of comparisons.',
    url: 'http://corestandards.org/Math/Content/5/NBT/A/3/b'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT.A.3.a',
    description: 'Read and write decimals to thousandths using base-ten numerals, number names, and expanded form, e.g., 347.392 = 3 × 100 + 4 × 10 + 7 × 1 + 3 × (1/10) + 9 × (1/100) + 2 × (1/1000).',
    url: 'http://corestandards.org/Math/Content/5/NBT/A/3/a'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT.A.3',
    description: 'Read, write, and compare decimals to thousandths.',
    url: 'http://corestandards.org/Math/Content/5/NBT/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT.A.2',
    description: 'Explain patterns in the number of zeros of the product when multiplying a number by powers of 10, and explain patterns in the placement of the decimal point when a decimal is multiplied or divided by a power of 10. Use whole-number exponents to denote powers of 10.',
    url: 'http://corestandards.org/Math/Content/5/NBT/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT.A.1',
    description: 'Recognize that in a multi-digit number, a digit in one place represents 10 times as much as it represents in the place to its right and 1/10 of what it represents in the place to its left.',
    url: 'http://corestandards.org/Math/Content/5/NBT/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT.A',
    description: 'Understand the place value system.',
    url: 'http://corestandards.org/Math/Content/5/NBT/A'
  },
  {
    identifier: 'CCSS.Math.Content.5.NBT',
    description: 'Number and Operations in Base Ten',
    url: 'http://corestandards.org/Math/Content/5/NBT/'
  },
  {
    identifier: 'CCSS.Math.Content.5.OA.B.3',
    description: 'Generate two numerical patterns using two given rules. Identify apparent relationships between corresponding terms. Form ordered pairs consisting of corresponding terms from the two patterns, and graph the ordered pairs on a coordinate plane.',
    url: 'http://corestandards.org/Math/Content/5/OA/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.5.OA.B',
    description: 'Analyze patterns and relationships.',
    url: 'http://corestandards.org/Math/Content/5/OA/B'
  },
  {
    identifier: 'CCSS.Math.Content.5.OA.A.2',
    description: 'Write simple expressions that record calculations with numbers, and interpret numerical expressions without evaluating them.',
    url: 'http://corestandards.org/Math/Content/5/OA/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.5.OA.A.1',
    description: 'Use parentheses, brackets, or braces in numerical expressions, and evaluate expressions with these symbols.',
    url: 'http://corestandards.org/Math/Content/5/OA/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.5.OA.A',
    description: 'Write and interpret numerical expressions.',
    url: 'http://corestandards.org/Math/Content/5/OA/A'
  },
  {
    identifier: 'CCSS.Math.Content.5.OA',
    description: 'Operations and Algebraic Thinking',
    url: 'http://corestandards.org/Math/Content/5/OA/'
  },
];

var grade6 = [
  {
    identifier: 'CCSS.Math.Content.6',
    description: 'Grade 6',
    url: 'http://corestandards.org/Math/Content/6'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP.B.5.d',
    description: 'Relating the choice of measures of center and variability to the shape of the data distribution and the context in which the data were gathered.',
    url: 'http://corestandards.org/Math/Content/6/SP/B/5/d'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP.B.5.c',
    description: 'Giving quantitative measures of center (median and/or mean) and variability (interquartile range and/or mean absolute deviation), as well as describing any overall pattern and any striking deviations from the overall pattern with reference to the context in which the data were gathered.',
    url: 'http://corestandards.org/Math/Content/6/SP/B/5/c'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP.B.5.b',
    description: 'Describing the nature of the attribute under investigation, including how it was measured and its units of measurement.',
    url: 'http://corestandards.org/Math/Content/6/SP/B/5/b'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP.B.5.a',
    description: 'Reporting the number of observations.',
    url: 'http://corestandards.org/Math/Content/6/SP/B/5/a'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP.B.5',
    description: 'Summarize numerical data sets in relation to their context, such as by:',
    url: 'http://corestandards.org/Math/Content/6/SP/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP.B.4',
    description: 'Display numerical data in plots on a number line, including dot plots, histograms, and box plots.',
    url: 'http://corestandards.org/Math/Content/6/SP/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP.B',
    description: 'Summarize and describe distributions.',
    url: 'http://corestandards.org/Math/Content/6/SP/B'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP.A.3',
    description: 'Recognize that a measure of center for a numerical data set summarizes all of its values with a single number, while a measure of variation describes how its values vary with a single number.',
    url: 'http://corestandards.org/Math/Content/6/SP/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP.A.2',
    description: 'Understand that a set of data collected to answer a statistical question has a distribution which can be described by its center, spread, and overall shape.',
    url: 'http://corestandards.org/Math/Content/6/SP/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP.A.1',
    description: 'Recognize a statistical question as one that anticipates variability in the data related to the question and accounts for it in the answers.',
    url: 'http://corestandards.org/Math/Content/6/SP/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP.A',
    description: 'Develop understanding of statistical variability.',
    url: 'http://corestandards.org/Math/Content/6/SP/A'
  },
  {
    identifier: 'CCSS.Math.Content.6.SP',
    description: 'Statistics and Probability',
    url: 'http://corestandards.org/Math/Content/6/SP'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.C.9',
    description: 'Use variables to represent two quantities in a real-world problem that change in relationship to one another; write an equation to express one quantity, thought of as the dependent variable, in terms of the other quantity, thought of as the independent variable. Analyze the relationship between the dependent and independent variables using graphs and tables, and relate these to the equation.',
    url: 'http://corestandards.org/Math/Content/6/EE/C/9'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.C',
    description: 'Represent and analyze quantitative relationships between dependent and independent variables.',
    url: 'http://corestandards.org/Math/Content/6/EE/C'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.B.8',
    description: 'Write an inequality of the form x > c or x < c to represent a constraint or condition in a real-world or mathematical problem. Recognize that inequalities of the form x > c or x < c have infinitely many solutions; represent solutions of such inequalities on number line diagrams.',
    url: 'http://corestandards.org/Math/Content/6/EE/B/8'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.B.7',
    description: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.',
    url: 'http://corestandards.org/Math/Content/6/EE/B/7'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.B.6',
    description: 'Use variables to represent numbers and write expressions when solving a real-world or mathematical problem; understand that a variable can represent an unknown number, or, depending on the purpose at hand, any number in a specified set.',
    url: 'http://corestandards.org/Math/Content/6/EE/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.B.5',
    description: 'Understand solving an equation or inequality as a process of answering a question: which values from a specified set, if any, make the equation or inequality true? Use substitution to determine whether a given number in a specified set makes an equation or inequality true.',
    url: 'http://corestandards.org/Math/Content/6/EE/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.B',
    description: 'Reason about and solve one-variable equations and inequalities.',
    url: 'http://corestandards.org/Math/Content/6/EE/B'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.A.4',
    description: 'Identify when two expressions are equivalent (i.e., when the two expressions name the same number regardless of which value is substituted into them).',
    url: 'http://corestandards.org/Math/Content/6/EE/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.A.3',
    description: 'Apply the properties of operations to generate equivalent expressions.',
    url: 'http://corestandards.org/Math/Content/6/EE/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.A.2.c',
    description: 'Evaluate expressions at specific values of their variables. Include expressions that arise from formulas used in real-world problems. Perform arithmetic operations, including those involving whole-number exponents, in the conventional order when there are no parentheses to specify a particular order (Order of Operations).',
    url: 'http://corestandards.org/Math/Content/6/EE/A/2/c'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.A.2.b',
    description: 'Identify parts of an expression using mathematical terms (sum, term, product, factor, quotient, coefficient); view one or more parts of an expression as a single entity.',
    url: 'http://corestandards.org/Math/Content/6/EE/A/2/b'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.A.2.a',
    description: 'Write expressions that record operations with numbers and with letters standing for numbers.',
    url: 'http://corestandards.org/Math/Content/6/EE/A/2/a'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.A.2',
    description: 'Write, read, and evaluate expressions in which letters stand for numbers.',
    url: 'http://corestandards.org/Math/Content/6/EE/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.A.1',
    description: 'Write and evaluate numerical expressions involving whole-number exponents.',
    url: 'http://corestandards.org/Math/Content/6/EE/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE.A',
    description: 'Apply and extend previous understandings of arithmetic to algebraic expressions.',
    url: 'http://corestandards.org/Math/Content/6/EE/A'
  },
  {
    identifier: 'CCSS.Math.Content.6.EE',
    description: 'Expressions and Equations',
    url: 'http://corestandards.org/Math/Content/6/EE'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C.8',
    description: 'Solve real-world and mathematical problems by graphing points in all four quadrants of the coordinate plane. Include use of coordinates and absolute value to find distances between points with the same first coordinate or the same second coordinate.',
    url: 'http://corestandards.org/Math/Content/6/NS/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C.7.d',
    description: 'Distinguish comparisons of absolute value from statements about order.',
    url: 'http://corestandards.org/Math/Content/6/NS/C/7/d'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C.7.c',
    description: 'Understand the absolute value of a rational number as its distance from 0 on the number line; interpret absolute value as magnitude for a positive or negative quantity in a real-world situation.',
    url: 'http://corestandards.org/Math/Content/6/NS/C/7/c'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C.7.b',
    description: 'Write, interpret, and explain statements of order for rational numbers in real-world contexts.',
    url: 'http://corestandards.org/Math/Content/6/NS/C/7/b'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C.7.a',
    description: 'Interpret statements of inequality as statements about the relative position of two numbers on a number line diagram.',
    url: 'http://corestandards.org/Math/Content/6/NS/C/7/a'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C.7',
    description: 'Understand ordering and absolute value of rational numbers.',
    url: 'http://corestandards.org/Math/Content/6/NS/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C.6.c',
    description: 'Find and position integers and other rational numbers on a horizontal or vertical number line diagram; find and position pairs of integers and other rational numbers on a coordinate plane.',
    url: 'http://corestandards.org/Math/Content/6/NS/C/6/c'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C.6.b',
    description: 'Understand signs of numbers in ordered pairs as indicating locations in quadrants of the coordinate plane; recognize that when two ordered pairs differ only by signs, the locations of the points are related by reflections across one or both axes.',
    url: 'http://corestandards.org/Math/Content/6/NS/C/6/b'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C.6.a',
    description: 'Recognize opposite signs of numbers as indicating locations on opposite sides of 0 on the number line; recognize that the opposite of the opposite of a number is the number itself, e.g., -(-3) = 3, and that 0 is its own opposite.',
    url: 'http://corestandards.org/Math/Content/6/NS/C/6/a'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C.6',
    description: 'Understand a rational number as a point on the number line. Extend number line diagrams and coordinate axes familiar from previous grades to represent points on the line and in the plane with negative number coordinates.',
    url: 'http://corestandards.org/Math/Content/6/NS/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C.5',
    description: 'Understand that positive and negative numbers are used together to describe quantities having opposite directions or values (e.g., temperature above/below zero, elevation above/below sea level, credits/debits, positive/negative electric charge); use positive and negative numbers to represent quantities in real-world contexts, explaining the meaning of 0 in each situation.',
    url: 'http://corestandards.org/Math/Content/6/NS/C/5'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.C',
    description: 'Apply and extend previous understandings of numbers to the system of rational numbers.',
    url: 'http://corestandards.org/Math/Content/6/NS/C'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.B.4',
    description: 'Find the greatest common factor of two whole numbers less than or equal to 100 and the least common multiple of two whole numbers less than or equal to 12. Use the distributive property to express a sum of two whole numbers 1—100 with a common factor as a multiple of a sum of two whole numbers with no common factor.',
    url: 'http://corestandards.org/Math/Content/6/NS/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.B.3',
    description: 'Fluently add, subtract, multiply, and divide multi-digit decimals using the standard algorithm for each operation.',
    url: 'http://corestandards.org/Math/Content/6/NS/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.B.2',
    description: 'Fluently divide multi-digit numbers using the standard algorithm.',
    url: 'http://corestandards.org/Math/Content/6/NS/B/2'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.B',
    description: 'Compute fluently with multi-digit numbers and find common factors and multiples.',
    url: 'http://corestandards.org/Math/Content/6/NS/B'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.A.1',
    description: 'Interpret and compute quotients of fractions, and solve word problems involving division of fractions by fractions, e.g., by using visual fraction models and equations to represent the problem.',
    url: 'http://corestandards.org/Math/Content/6/NS/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS.A',
    description: 'Apply and extend previous understandings of multiplication and division to divide fractions by fractions.',
    url: 'http://corestandards.org/Math/Content/6/NS/A'
  },
  {
    identifier: 'CCSS.Math.Content.6.NS',
    description: 'The Number System',
    url: 'http://corestandards.org/Math/Content/6/NS/'
  },
  {
    identifier: 'CCSS.Math.Content.6.RP.A.3.d',
    description: 'Use ratio reasoning to convert measurement units; manipulate and transform units appropriately when multiplying or dividing quantities.',
    url: 'http://corestandards.org/Math/Content/6/RP/A/3/d'
  },
  {
    identifier: 'CCSS.Math.Content.6.RP.A.3.c',
    description: 'Find a percent of a quantity as a rate per 100 (e.g., 30% of a quantity means 30/100 times the quantity); solve problems involving finding the whole, given a part and the percent.',
    url: 'http://corestandards.org/Math/Content/6/RP/A/3/c'
  },
  {
    identifier: 'CCSS.Math.Content.6.RP.A.3.b',
    description: 'Solve unit rate problems including those involving unit pricing and constant speed.',
    url: 'http://corestandards.org/Math/Content/6/RP/A/3/b'
  },
  {
    identifier: 'CCSS.Math.Content.6.RP.A.3.a',
    description: 'Make tables of equivalent ratios relating quantities with whole number measurements, find missing values in the tables, and plot the pairs of values on the coordinate plane. Use tables to compare ratios.',
    url: 'http://corestandards.org/Math/Content/6/RP/A/3/a'
  },
  {
    identifier: 'CCSS.Math.Content.6.RP.A.3',
    description: 'Use ratio and rate reasoning to solve real-world and mathematical problems, e.g., by reasoning about tables of equivalent ratios, tape diagrams, double number line diagrams, or equations.',
    url: 'http://corestandards.org/Math/Content/6/RP/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.6.RP.A.2',
    description: 'Understand the concept of a unit rate a/b associated with a ratio a:b with b ≠ 0, and use rate language in the context of a ratio relationship.',
    url: 'http://corestandards.org/Math/Content/6/RP/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.6.RP.A.1',
    description: 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.',
    url: 'http://corestandards.org/Math/Content/6/RP/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.6.RP.A',
    description: 'Understand ratio concepts and use ratio reasoning to solve problems.',
    url: 'http://corestandards.org/Math/Content/6/RP/A'
  },
  {
    identifier: 'CCSS.Math.Content.6.RP',
    description: 'Ratios and Proportional Relationships',
    url: 'http://corestandards.org/Math/Content/6/RP'
  },
  {
    identifier: 'CCSS.Math.Content.6.G.A.4',
    description: 'Represent three-dimensional figures using nets made up of rectangles and triangles, and use the nets to find the surface area of these figures. Apply these techniques in the context of solving real-world and mathematical problems.',
    url: 'http://corestandards.org/Math/Content/6/G/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.6.G.A.3',
    description: 'Draw polygons in the coordinate plane given coordinates for the vertices; use coordinates to find the length of a side joining points with the same first coordinate or the same second coordinate. Apply these techniques in the context of solving real-world and mathematical problems.',
    url: 'http://corestandards.org/Math/Content/6/G/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.6.G.A.2',
    description: 'Find the volume of a right rectangular prism with fractional edge lengths by packing it with unit cubes of the appropriate unit fraction edge lengths, and show that the volume is the same as would be found by multiplying the edge lengths of the prism. Apply the formulas V = l w h and V = b h to find volumes of right rectangular prisms with fractional edge lengths in the context of solving real-world and mathematical problems.',
    url: 'http://corestandards.org/Math/Content/6/G/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.6.G.A.1',
    description: 'Find the area of right triangles, other triangles, special quadrilaterals, and polygons by composing into rectangles or decomposing into triangles and other shapes; apply these techniques in the context of solving real-world and mathematical problems.',
    url: 'http://corestandards.org/Math/Content/6/G/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.6.G.A',
    description: 'Solve real-world and mathematical problems involving area, surface area, and volume.',
    url: 'http://corestandards.org/Math/Content/6/G/A'
  },
  {
    identifier: 'CCSS.Math.Content.6.G',
    description: 'Geometry',
    url: 'http://corestandards.org/Math/Content/6/G'
  },
];

var grade7 = [
  {
    identifier: 'CCSS.Math.Content.7',
    description: 'Grade 7',
    url: 'http://corestandards.org/Math/Content/7'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.C.8.c',
    description: 'Design and use a simulation to generate frequencies for compound events.',
    url: 'http://corestandards.org/Math/Content/7/SP/C/8/c'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.C.8.b',
    description: 'Represent sample spaces for compound events using methods such as organized lists, tables and tree diagrams. For an event described in everyday language (e.g., "rolling double sixes"), identify the outcomes in the sample space which compose the event.',
    url: 'http://corestandards.org/Math/Content/7/SP/C/8/b'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.C.8.a',
    description: 'Understand that, just as with simple events, the probability of a compound event is the fraction of outcomes in the sample space for which the compound event occurs.',
    url: 'http://corestandards.org/Math/Content/7/SP/C/8/a'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.C.8',
    description: 'Find probabilities of compound events using organized lists, tables, tree diagrams, and simulation.',
    url: 'http://corestandards.org/Math/Content/7/SP/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.C.7.b',
    description: 'Develop a probability model (which may not be uniform) by observing frequencies in data generated from a chance process.',
    url: 'http://corestandards.org/Math/Content/7/SP/C/7/b'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.C.7.a',
    description: 'Develop a uniform probability model by assigning equal probability to all outcomes, and use the model to determine probabilities of events.',
    url: 'http://corestandards.org/Math/Content/7/SP/C/7/a'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.C.7',
    description: 'Develop a probability model and use it to find probabilities of events. Compare probabilities from a model to observed frequencies; if the agreement is not good, explain possible sources of the discrepancy.',
    url: 'http://corestandards.org/Math/Content/7/SP/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.C.6',
    description: 'Approximate the probability of a chance event by collecting data on the chance process that produces it and observing its long-run relative frequency, and predict the approximate relative frequency given the probability.',
    url: 'http://corestandards.org/Math/Content/7/SP/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.C.5',
    description: 'Understand that the probability of a chance event is a number between 0 and 1 that expresses the likelihood of the event occurring. Larger numbers indicate greater likelihood. A probability near 0 indicates an unlikely event, a probability around 1/2 indicates an event that is neither unlikely nor likely, and a probability near 1 indicates a likely event.',
    url: 'http://corestandards.org/Math/Content/7/SP/C/5'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.C',
    description: 'Investigate chance processes and develop, use, and evaluate probability models.',
    url: 'http://corestandards.org/Math/Content/7/SP/C'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.B.4',
    description: 'Use measures of center and measures of variability for numerical data from random samples to draw informal comparative inferences about two populations.',
    url: 'http://corestandards.org/Math/Content/7/SP/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.B.3',
    description: 'Informally assess the degree of visual overlap of two numerical data distributions with similar variabilities, measuring the difference between the centers by expressing it as a multiple of a measure of variability.',
    url: 'http://corestandards.org/Math/Content/7/SP/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.B',
    description: 'Draw informal comparative inferences about two populations.',
    url: 'http://corestandards.org/Math/Content/7/SP/B'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.A.2',
    description: 'Use data from a random sample to draw inferences about a population with an unknown characteristic of interest. Generate multiple samples (or simulated samples) of the same size to gauge the variation in estimates or predictions.',
    url: 'http://corestandards.org/Math/Content/7/SP/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.A.1',
    description: 'Understand that statistics can be used to gain information about a population by examining a sample of the population; generalizations about a population from a sample are valid only if the sample is representative of that population. Understand that random sampling tends to produce representative samples and support valid inferences.',
    url: 'http://corestandards.org/Math/Content/7/SP/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP.A',
    description: 'Use random sampling to draw inferences about a population.',
    url: 'http://corestandards.org/Math/Content/7/SP/A'
  },
  {
    identifier: 'CCSS.Math.Content.7.SP',
    description: 'Statistics and Probability',
    url: 'http://corestandards.org/Math/Content/7/SP/'
  },
  {
    identifier: 'CCSS.Math.Content.7.EE.B.4.b',
    description: 'Solve word problems leading to inequalities of the form px + q > r or px + q < r, where p, q, and r are specific rational numbers. Graph the solution set of the inequality and interpret it in the context of the problem.',
    url: 'http://corestandards.org/Math/Content/7/EE/B/4/b'
  },
  {
    identifier: 'CCSS.Math.Content.7.EE.B.4.a',
    description: 'Solve word problems leading to equations of the form px + q = r and p(x + q) = r, where p, q, and r are specific rational numbers. Solve equations of these forms fluently. Compare an algebraic solution to an arithmetic solution, identifying the sequence of the operations used in each approach.',
    url: 'http://corestandards.org/Math/Content/7/EE/B/4/a'
  },
  {
    identifier: 'CCSS.Math.Content.7.EE.B.4',
    description: 'Use variables to represent quantities in a real-world or mathematical problem, and construct simple equations and inequalities to solve problems by reasoning about the quantities.',
    url: 'http://corestandards.org/Math/Content/7/EE/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.7.EE.B.3',
    description: 'Solve multi-step real-life and mathematical problems posed with positive and negative rational numbers in any form (whole numbers, fractions, and decimals), using tools strategically. Apply properties of operations to calculate with numbers in any form; convert between forms as appropriate; and assess the reasonableness of answers using mental computation and estimation strategies.',
    url: 'http://corestandards.org/Math/Content/7/EE/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.7.EE.B',
    description: 'Solve real-life and mathematical problems using numerical and algebraic expressions and equations.',
    url: 'http://corestandards.org/Math/Content/7/EE/B'
  },
  {
    identifier: 'CCSS.Math.Content.7.EE.A.2',
    description: 'Understand that rewriting an expression in different forms in a problem context can shed light on the problem and how the quantities in it are related.',
    url: 'http://corestandards.org/Math/Content/7/EE/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.7.EE.A.1',
    description: 'Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients.',
    url: 'http://corestandards.org/Math/Content/7/EE/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.7.EE.A',
    description: 'Use properties of operations to generate equivalent expressions.',
    url: 'http://corestandards.org/Math/Content/7/EE/A'
  },
  {
    identifier: 'CCSS.Math.Content.7.EE',
    description: 'Expressions and Equations',
    url: 'http://corestandards.org/Math/Content/7/EE/'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A.3',
    description: 'Solve real-world and mathematical problems involving the four operations with rational numbers.',
    url: 'http://corestandards.org/Math/Content/7/NS/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A.2.d',
    description: 'Convert a rational number to a decimal using long division; know that the decimal form of a rational number terminates in 0s or eventually repeats.',
    url: 'http://corestandards.org/Math/Content/7/NS/A/2/d'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A.2.c',
    description: 'Apply properties of operations as strategies to multiply and divide rational numbers.',
    url: 'http://corestandards.org/Math/Content/7/NS/A/2/c'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A.2.b',
    description: 'Understand that integers can be divided, provided that the divisor is not zero, and every quotient of integers (with non-zero divisor) is a rational number. If p and q are integers, then -(p/q) = (-p)/q = p/(-q). Interpret quotients of rational numbers by describing real-world contexts.',
    url: 'http://corestandards.org/Math/Content/7/NS/A/2/b'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A.2.a',
    description: 'Understand that multiplication is extended from fractions to rational numbers by requiring that operations continue to satisfy the properties of operations, particularly the distributive property, leading to products such as (-1)(-1) = 1 and the rules for multiplying signed numbers. Interpret products of rational numbers by describing real-world contexts.',
    url: 'http://corestandards.org/Math/Content/7/NS/A/2/a'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A.2',
    description: 'Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.',
    url: 'http://corestandards.org/Math/Content/7/NS/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A.1.d',
    description: 'Apply properties of operations as strategies to add and subtract rational numbers.',
    url: 'http://corestandards.org/Math/Content/7/NS/A/1/d'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A.1.c',
    description: 'Understand subtraction of rational numbers as adding the additive inverse, p - q = p + (-q). Show that the distance between two rational numbers on the number line is the absolute value of their difference, and apply this principle in real-world contexts.',
    url: 'http://corestandards.org/Math/Content/7/NS/A/1/c'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A.1.b',
    description: 'Understand p + q as the number located a distance |q| from p, in the positive or negative direction depending on whether q is positive or negative. Show that a number and its opposite have a sum of 0 (are additive inverses). Interpret sums of rational numbers by describing real-world contexts.',
    url: 'http://corestandards.org/Math/Content/7/NS/A/1/b'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A.1.a',
    description: 'Describe situations in which opposite quantities combine to make 0.',
    url: 'http://corestandards.org/Math/Content/7/NS/A/1/a'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A.1',
    description: 'Apply and extend previous understandings of addition and subtraction to add and subtract rational numbers; represent addition and subtraction on a horizontal or vertical number line diagram.',
    url: 'http://corestandards.org/Math/Content/7/NS/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A',
    description: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.',
    url: 'http://corestandards.org/Math/Content/7/NS/A'
  },
  {
    identifier: 'CCSS.Math.Content.7.NS.A',
    description: 'The Number System',
    url: 'http://corestandards.org/Math/Content/7/NS'
  },
  {
    identifier: 'CCSS.Math.Content.7.RP.A.3',
    description: 'Use proportional relationships to solve multistep ratio and percent problems.',
    url: 'http://corestandards.org/Math/Content/7/RP/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.7.RP.A.2.d',
    description: 'Explain what a point (x, y) on the graph of a proportional relationship means in terms of the situation, with special attention to the points (0, 0) and (1, r) where r is the unit rate.',
    url: 'http://corestandards.org/Math/Content/7/RP/A/2/d'
  },
  {
    identifier: 'CCSS.Math.Content.7.RP.A.2.c',
    description: 'Represent proportional relationships by equations.',
    url: 'http://corestandards.org/Math/Content/7/RP/A/2/c'
  },
  {
    identifier: 'CCSS.Math.Content.7.RP.A.2.b',
    description: 'Identify the constant of proportionality (unit rate) in tables, graphs, equations, diagrams, and verbal descriptions of proportional relationships.',
    url: 'http://corestandards.org/Math/Content/7/RP/A/2/b'
  },
  {
    identifier: 'CCSS.Math.Content.7.RP.A.2.a',
    description: 'Decide whether two quantities are in a proportional relationship, e.g., by testing for equivalent ratios in a table or graphing on a coordinate plane and observing whether the graph is a straight line through the origin.',
    url: 'http://corestandards.org/Math/Content/7/RP/A/2/a'
  },
  {
    identifier: 'CCSS.Math.Content.7.RP.A.2',
    description: 'Recognize and represent proportional relationships between quantities.',
    url: 'http://corestandards.org/Math/Content/7/RP/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.7.RP.A.1',
    description: 'Compute unit rates associated with ratios of fractions, including ratios of lengths, areas and other quantities measured in like or different units.',
    url: 'http://corestandards.org/Math/Content/7/RP/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.7.RP.A',
    description: 'Analyze proportional relationships and use them to solve real-world and mathematical problems.',
    url: 'http://corestandards.org/Math/Content/7/RP/A'
  },
  {
    identifier: 'CCSS.Math.Content.7.RP',
    description: 'Ratios and Proportional Relationships',
    url: 'http://corestandards.org/Math/Content/7/RP/'
  },
  {
    identifier: 'CCSS.Math.Content.7.G.B.6',
    description: 'Solve real-world and mathematical problems involving area, volume and surface area of two- and three-dimensional objects composed of triangles, quadrilaterals, polygons, cubes, and right prisms.',
    url: 'http://corestandards.org/Math/Content/7/G/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.7.G.B.5',
    description: 'Use facts about supplementary, complementary, vertical, and adjacent angles in a multi-step problem to write and solve simple equations for an unknown angle in a figure.',
    url: 'http://corestandards.org/Math/Content/7/G/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.7.G.B.4',
    description: 'Know the formulas for the area and circumference of a circle and use them to solve problems; give an informal derivation of the relationship between the circumference and area of a circle.',
    url: 'http://corestandards.org/Math/Content/7/G/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.7.G.B',
    description: 'Solve real-life and mathematical problems involving angle measure, area, surface area, and volume.',
    url: 'http://corestandards.org/Math/Content/7/G/B'
  },
  {
    identifier: 'CCSS.Math.Content.7.G.A.3',
    description: 'Describe the two-dimensional figures that result from slicing three-dimensional figures, as in plane sections of right rectangular prisms and right rectangular pyramids.',
    url: 'http://corestandards.org/Math/Content/7/G/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.7.G.A.2',
    description: 'Draw (freehand, with ruler and protractor, and with technology) geometric shapes with given conditions. Focus on constructing triangles from three measures of angles or sides, noticing when the conditions determine a unique triangle, more than one triangle, or no triangle.',
    url: 'http://corestandards.org/Math/Content/7/G/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.7.G.A.1',
    description: 'Solve problems involving scale drawings of geometric figures, including computing actual lengths and areas from a scale drawing and reproducing a scale drawing at a different scale.',
    url: 'http://corestandards.org/Math/Content/7/G/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.7.G.A',
    description: 'Draw, construct, and describe geometrical figures and describe the relationships between them.',
    url: 'http://corestandards.org/Math/Content/7/G/A'
  },
  {
    identifier: 'CCSS.Math.Content.7.G',
    description: 'Geometry',
    url: 'http://corestandards.org/Math/Content/7/G/'
  },
];

var grade8 = [
  {
    identifier: 'CCSS.Math.Content.8',
    description: 'Grade 8',
    url: 'http://corestandards.org/Math/Content/8'
  },
  {
    identifier: 'CCSS.Math.Content.8.F.B.5',
    description: 'Describe qualitatively the functional relationship between two quantities by analyzing a graph (e.g., where the function is increasing or decreasing, linear or nonlinear). Sketch a graph that exhibits the qualitative features of a function that has been described verbally.',
    url: 'http://corestandards.org/Math/Content/8/F/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.8.F.B.4',
    description: 'Construct a function to model a linear relationship between two quantities. Determine the rate of change and initial value of the function from a description of a relationship or from two (x, y) values, including reading these from a table or from a graph. Interpret the rate of change and initial value of a linear function in terms of the situation it models, and in terms of its graph or a table of values.',
    url: 'http://corestandards.org/Math/Content/8/F/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.8.F.B',
    description: 'Use functions to model relationships between quantities.',
    url: 'http://corestandards.org/Math/Content/8/F/B'
  },
  {
    identifier: 'CCSS.Math.Content.8.F.A.3',
    description: 'Interpret the equation y = mx + b as defining a linear function, whose graph is a straight line; give examples of functions that are not linear.',
    url: 'http://corestandards.org/Math/Content/8/F/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.8.F.A.2',
    description: 'Compare properties of two functions each represented in a different way (algebraically, graphically, numerically in tables, or by verbal descriptions).',
    url: 'http://corestandards.org/Math/Content/8/F/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.8.F.A.1',
    description: 'Understand that a function is a rule that assigns to each input exactly one output. The graph of a function is the set of ordered pairs consisting of an input and the corresponding output.',
    url: 'http://corestandards.org/Math/Content/8/F/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.8.F.A',
    description: 'Define, evaluate, and compare functions.',
    url: 'http://corestandards.org/Math/Content/8/F/A'
  },
  {
    identifier: 'CCSS.Math.Content.8.F',
    description: 'Functions',
    url: 'http://corestandards.org/Math/Content/8/F'
  },
  {
    identifier: 'CCSS.Math.Content.8.SP.A.4',
    description: 'Understand that patterns of association can also be seen in bivariate categorical data by displaying frequencies and relative frequencies in a two-way table. Construct and interpret a two-way table summarizing data on two categorical variables collected from the same subjects. Use relative frequencies calculated for rows or columns to describe possible association between the two variables.',
    url: 'http://corestandards.org/Math/Content/8/SP/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.8.SP.A.3',
    description: 'Use the equation of a linear model to solve problems in the context of bivariate measurement data, interpreting the slope and intercept.',
    url: 'http://corestandards.org/Math/Content/8/SP/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.8.SP.A.2',
    description: 'Know that straight lines are widely used to model relationships between two quantitative variables. For scatter plots that suggest a linear association, informally fit a straight line, and informally assess the model fit by judging the closeness of the data points to the line.',
    url: 'http://corestandards.org/Math/Content/8/SP/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.8.SP.A.1',
    description: 'Construct and interpret scatter plots for bivariate measurement data to investigate patterns of association between two quantities. Describe patterns such as clustering, outliers, positive or negative association, linear association, and nonlinear association.',
    url: 'http://corestandards.org/Math/Content/8/SP/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.8.SP.A',
    description: 'Investigate patterns of association in bivariate data.',
    url: 'http://corestandards.org/Math/Content/8/SP/A'
  },
  {
    identifier: 'CCSS.Math.Content.8.SP',
    description: 'Statistics and Probability',
    url: 'http://corestandards.org/Math/Content/8/SP'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.C.8.c',
    description: 'Solve real-world and mathematical problems leading to two linear equations in two variables.',
    url: 'http://corestandards.org/Math/Content/8/EE/C/8/c'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.C.8.b',
    description: 'Solve systems of two linear equations in two variables algebraically, and estimate solutions by graphing the equations. Solve simple cases by inspection.',
    url: 'http://corestandards.org/Math/Content/8/EE/C/8/b'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.C.8.a',
    description: 'Understand that solutions to a system of two linear equations in two variables correspond to points of intersection of their graphs, because points of intersection satisfy both equations simultaneously.',
    url: 'http://corestandards.org/Math/Content/8/EE/C/8/a'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.C.8',
    description: 'Analyze and solve pairs of simultaneous linear equations.',
    url: 'http://corestandards.org/Math/Content/8/EE/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.C.7.b',
    description: 'Solve linear equations with rational number coefficients, including equations whose solutions require expanding expressions using the distributive property and collecting like terms.',
    url: 'http://corestandards.org/Math/Content/8/EE/C/7/b'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.C.7.a',
    description: 'Give examples of linear equations in one variable with one solution, infinitely many solutions, or no solutions. Show which of these possibilities is the case by successively transforming the given equation into simpler forms, until an equivalent equation of the form x = a, a = a, or a = b results (where a and b are different numbers).',
    url: 'http://corestandards.org/Math/Content/8/EE/C/7/a'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.C.7',
    description: 'Solve linear equations in one variable.',
    url: 'http://corestandards.org/Math/Content/8/EE/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.C',
    description: 'Analyze and solve linear equations and pairs of simultaneous linear equations.',
    url: 'http://corestandards.org/Math/Content/8/EE/C'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.B.6',
    description: 'Use similar triangles to explain why the slope m is the same between any two distinct points on a non-vertical line in the coordinate plane; derive the equation y = mx for a line through the origin and the equation y = mx + b for a line intercepting the vertical axis at b.',
    url: 'http://corestandards.org/Math/Content/8/EE/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.B.5',
    description: 'Graph proportional relationships, interpreting the unit rate as the slope of the graph. Compare two different proportional relationships represented in different ways.',
    url: 'http://corestandards.org/Math/Content/8/EE/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.B',
    description: 'Understand the connections between proportional relationships, lines, and linear equations.',
    url: 'http://corestandards.org/Math/Content/8/EE/B'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.A.4',
    description: 'Perform operations with numbers expressed in scientific notation, including problems where both decimal and scientific notation are used. Use scientific notation and choose units of appropriate size for measurements of very large or very small quantities (e.g., use millimeters per year for seafloor spreading). Interpret scientific notation that has been generated by technology.',
    url: 'http://corestandards.org/Math/Content/8/EE/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.A.3',
    description: 'Use numbers expressed in the form of a single digit times an integer power of 10 to estimate very large or very small quantities, and to express how many times as much one is than the other.',
    url: 'http://corestandards.org/Math/Content/8/EE/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.A.2',
    description: 'Use square root and cube root symbols to represent solutions to equations of the form x² = p and x³ = p, where p is a positive rational number. Evaluate square roots of small perfect squares and cube roots of small perfect cubes. Know that √2 is irrational.',
    url: 'http://corestandards.org/Math/Content/8/EE/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.A.1',
    description: 'Know and apply the properties of integer exponents to generate equivalent numerical expressions.',
    url: 'http://corestandards.org/Math/Content/8/EE/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.8.EE.A',
    description: 'Work with radicals and integer exponents.',
    url: 'http://corestandards.org/Math/Content/8/EE/A'
  },
  {
    _id: ObjectId('5bb650e1fefbf3cf9e88f675'),
    identifier: 'CCSS.Math.Content.8.EE',
    description: 'Expressions and Equations',
    url: 'http://corestandards.org/Math/Content/8/EE'
  },
  {
    identifier: 'CCSS.Math.Content.8.NS.A.2',
    description: 'Use rational approximations of irrational numbers to compare the size of irrational numbers, locate them approximately on a number line diagram, and estimate the value of expressions (e.g., π²).',
    url: 'http://corestandards.org/Math/Content/8/NS/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.8.NS.A.1',
    description: 'Know that numbers that are not rational are called irrational. Understand informally that every number has a decimal expansion; for rational numbers show that the decimal expansion repeats eventually, and convert a decimal expansion which repeats eventually into a rational number.',
    url: 'http://corestandards.org/Math/Content/8/NS/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.8.NS.A',
    description: 'Know that there are numbers that are not rational, and approximate them by rational numbers.',
    url: 'http://corestandards.org/Math/Content/8/NS/A'
  },
  {
    identifier: 'CCSS.Math.Content.8.NS',
    description: 'The Number System',
    url: 'http://corestandards.org/Math/Content/8/NS'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.C.9',
    description: 'Know the formulas for the volumes of cones, cylinders, and spheres and use them to solve real-world and mathematical problems.',
    url: 'http://corestandards.org/Math/Content/8/G/C/9'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.C',
    description: 'Solve real-world and mathematical problems involving volume of cylinders, cones, and spheres.',
    url: 'http://corestandards.org/Math/Content/8/G/C'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.B.8',
    description: 'Apply the Pythagorean Theorem to find the distance between two points in a coordinate system.',
    url: 'http://corestandards.org/Math/Content/8/G/B/8'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.B.7',
    description: 'Apply the Pythagorean Theorem to determine unknown side lengths in right triangles in real-world and mathematical problems in two and three dimensions.',
    url: 'http://corestandards.org/Math/Content/8/G/B/7'
  },
  {
    _id: ObjectId('5bb650e1fefbf3cf9e88f8f6'),
    identifier: 'CCSS.Math.Content.8.G.B.6',
    description: 'Explain a proof of the Pythagorean Theorem and its converse.',
    url: 'http://corestandards.org/Math/Content/8/G/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.B',
    description: 'Understand and apply the Pythagorean Theorem.',
    url: 'http://corestandards.org/Math/Content/8/G/B'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.A.5',
    description: 'Use informal arguments to establish facts about the angle sum and exterior angle of triangles, about the angles created when parallel lines are cut by a transversal, and the angle-angle criterion for similarity of triangles.',
    url: 'http://corestandards.org/Math/Content/8/G/A/5'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.A.4',
    description: 'Understand that a two-dimensional figure is similar to another if the second can be obtained from the first by a sequence of rotations, reflections, translations, and dilations; given two similar two-dimensional figures, describe a sequence that exhibits the similarity between them.',
    url: 'http://corestandards.org/Math/Content/8/G/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.A.3',
    description: 'Describe the effect of dilations, translations, rotations, and reflections on two-dimensional figures using coordinates.',
    url: 'http://corestandards.org/Math/Content/8/G/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.A.2',
    description: 'Understand that a two-dimensional figure is congruent to another if the second can be obtained from the first by a sequence of rotations, reflections, and translations; given two congruent figures, describe a sequence that exhibits the congruence between them.',
    url: 'http://corestandards.org/Math/Content/8/G/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.A.1.c',
    description: 'Parallel lines are taken to parallel lines.',
    url: 'http://corestandards.org/Math/Content/8/G/A/1/c'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.A.1.b',
    description: 'Angles are taken to angles of the same measure.',
    url: 'http://corestandards.org/Math/Content/8/G/A/1/b'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.A.1.a',
    description: 'Lines are taken to lines, and line segments to line segments of the same length.',
    url: 'http://corestandards.org/Math/Content/8/G/A/1/a'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.A.1',
    description: 'Verify experimentally the properties of rotations, reflections, and translations:',
    url: 'http://corestandards.org/Math/Content/8/G/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.8.G.A',
    description: 'Understand congruence and similarity using physical models, transparencies, or geometry software.',
    url: 'http://corestandards.org/Math/Content/8/G/A'
  },
  {
    identifier: 'CCSS.Math.Content.8.G',
    description: 'Geometry',
    url: 'http://corestandards.org/Math/Content/8/G/'
  },
];

var gradeHSS = [
  {
    identifier: 'CCSS.Math.Content.HSS',
    description: 'High School - Statistics & Probability',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B/5/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B.7',
    description: '(+) Analyze decisions and strategies using probability concepts (e.g., product testing, medical testing, pulling a hockey goalie at the end of a game).',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B.6',
    description: '(+) Use probabilities to make fair decisions (e.g., drawing by lots, using a random number generator).',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B.5.b',
    description: 'Evaluate and compare strategies on the basis of expected values.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B/5/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B.5.a',
    description: 'Find the expected payoff for a game of chance.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B/5/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B.5',
    description: '(+) Weigh the possible outcomes of a decision by assigning probabilities to payoff values and finding expected values.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B',
    description: 'Use probability to evaluate outcomes of decisions',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.A.4',
    description: '(+) Develop a probability distribution for a random variable defined for a sample space in which probabilities are assigned empirically; find the expected value.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.A.3',
    description: '(+) Develop a probability distribution for a random variable defined for a sample space in which theoretical probabilities can be calculated; find the expected value.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.A.2',
    description: '(+) Calculate the expected value of a random variable; interpret it as the mean of the probability distribution.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.A.1',
    description: '(+) Define a random variable for a quantity of interest by assigning a numerical value to each event in a sample space; graph the corresponding probability distribution using the same graphical displays as for data distributions.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.A',
    description: 'Calculate expected values and use them to solve problems',
    url: 'http://corestandards.org/Math/Content/HSS/MD/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD',
    description: 'Using Probability to Make Decisions',
    url: 'http://corestandards.org/Math/Content/HSS/MD/'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.B.9',
    description: '(+) Use permutations and combinations to compute probabilities of compound events and solve problems.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/B/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.B.8',
    description: '(+) Apply the general Multiplication Rule in a uniform probability model, P(A and B) = P(A)P(B|A) = P(B)P(A|B), and interpret the answer in terms of the model.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/B/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.B.7',
    description: 'Apply the Addition Rule, P(A or B) = P(A) + P(B) - P(A and B), and interpret the answer in terms of the model.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/B/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.B.6',
    description: 'Find the conditional probability of A given B as the fraction of B\'s outcomes that also belong to A, and interpret the answer in terms of the model.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.B',
    description: 'Use the rules of probability to compute probabilities of compound events in a uniform probability model',
    url: 'http://corestandards.org/Math/Content/HSS/CP/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A.5',
    description: 'Recognize and explain the concepts of conditional probability and independence in everyday language and everyday situations.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A.4',
    description: 'Construct and interpret two-way frequency tables of data when two categories are associated with each object being classified. Use the two-way table as a sample space to decide if events are independent and to approximate conditional probabilities.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A.3',
    description: 'Understand the conditional probability of A given B as P(A and B)/P(B), and interpret independence of A and B as saying that the conditional probability of A given B is the same as the probability of A, and the conditional probability of B given A is the same as the probability of B.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A.2',
    description: 'Understand that two events A and B are independent if the probability of A and B occurring together is the product of their probabilities, and use this characterization to determine if they are independent.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A.1',
    description: 'Describe events as subsets of a sample space (the set of outcomes) using characteristics (or categories) of the outcomes, or as unions, intersections, or complements of other events ("or," "and," "not").',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A',
    description: 'Understand independence and conditional probability and use them to interpret data',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP',
    description: 'Conditional Probability and the Rules of Probability',
    url: 'http://corestandards.org/Math/Content/HSS/CP/'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.B.6',
    description: 'Evaluate reports based on data.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.B.5',
    description: 'Use data from a randomized experiment to compare two treatments; use simulations to decide if differences between parameters are significant.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.B.4',
    description: 'Use data from a sample survey to estimate a population mean or proportion; develop a margin of error through the use of simulation models for random sampling.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.B.3',
    description: 'Recognize the purposes of and differences among sample surveys, experiments, and observational studies; explain how randomization relates to each.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.B',
    description: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies',
    url: 'http://corestandards.org/Math/Content/HSS/IC/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.A.2',
    description: 'Decide if a specified model is consistent with results from a given data-generating process, e.g., using simulation.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.A.1',
    description: 'Understand statistics as a process for making inferences about population parameters based on a random sample from that population.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.A',
    description: 'Understand and evaluate random processes underlying statistical experiments',
    url: 'http://corestandards.org/Math/Content/HSS/IC/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC',
    description: 'Making Inferences and Justifying Conclusions',
    url: 'phil add url!'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.C.9',
    description: 'Distinguish between correlation and causation.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/C/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.C.8',
    description: 'Compute (using technology) and interpret the correlation coefficient of a linear fit.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.C.7',
    description: 'Interpret the slope (rate of change) and the intercept (constant term) of a linear model in the context of the data.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.C',
    description: 'Interpret linear models',
    url: 'http://corestandards.org/Math/Content/HSS/ID/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B.6.c',
    description: 'Fit a linear function for a scatter plot that suggests a linear association.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B/6/c'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B.6.b',
    description: 'Informally assess the fit of a function by plotting and analyzing residuals.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B/6/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B.6.a',
    description: 'Fit a function to the data; use functions fitted to data to solve problems in the context of the data.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B/6/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B.6',
    description: 'Represent data on two quantitative variables on a scatter plot, and describe how the variables are related.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B.5',
    description: 'Summarize categorical data for two categories in two-way frequency tables. Interpret relative frequencies in the context of the data (including joint, marginal, and conditional relative frequencies). Recognize possible associations and trends in the data.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B',
    description: 'Summarize, represent, and interpret data on two categorical and quantitative variables',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.A.4',
    description: 'Use the mean and standard deviation of a data set to fit it to a normal distribution and to estimate population percentages. Recognize that there are data sets for which such a procedure is not appropriate. Use calculators, spreadsheets, and tables to estimate areas under the normal curve.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.A.3',
    description: 'Interpret differences in shape, center, and spread in the context of the data sets, accounting for possible effects of extreme data points (outliers).',
    url: 'http://corestandards.org/Math/Content/HSS/ID/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.A.2',
    description: 'Use statistics appropriate to the shape of the data distribution to compare center (median, mean) and spread (interquartile range, standard deviation) of two or more different data sets.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.A.1',
    description: 'Represent data with plots on the real number line (dot plots, histograms, and box plots).',
    url: 'http://corestandards.org/Math/Content/HSS/ID/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.A',
    description: 'Summarize, represent, and interpret data on a single count or measurement variable',
    url: 'http://corestandards.org/Math/Content/HSS/ID/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID',
    description: 'Interpreting Categorical & Quantitative Data',
    url: 'http://corestandards.org/Math/Content/HSS/ID'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.MG.A.3',
    description: 'Apply geometric methods to solve design problems (e.g., designing an object or structure to satisfy physical constraints or minimize cost; working with typographic grid systems based on ratios).',
    url: 'http://corestandards.org/Math/Content/HSG/MG/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.MG.A.2',
    description: 'Apply concepts of density based on area and volume in modeling situations (e.g., persons per square mile, BTUs per cubic foot).',
    url: 'http://corestandards.org/Math/Content/HSG/MG/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.MG.A.1',
    description: 'Use geometric shapes, their measures, and their properties to describe objects (e.g., modeling a tree trunk or a human torso as a cylinder).',
    url: 'http://corestandards.org/Math/Content/HSG/MG/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.MG.A',
    description: 'Apply geometric concepts in modeling situations',
    url: 'http://corestandards.org/Math/Content/HSG/MG/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.MG',
    description: 'Modeling with Geometry',
    url: 'http://corestandards.org/Math/Content/HSG/MG/'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.B.4',
    description: 'Identify the shapes of two-dimensional cross-sections of three-dimensional objects, and identify three-dimensional objects generated by rotations of two-dimensional objects.',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.B',
    description: 'Visualize relationships between two-dimensional and three-dimensional objects',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.A.3',
    description: 'Use volume formulas for cylinders, pyramids, cones, and spheres to solve problems.',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.A.2',
    description: '(+) Give an informal argument using Cavalieri\'s principle for the formulas for the volume of a sphere and other solid figures.',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.A.1',
    description: 'Give an informal argument for the formulas for the circumference of a circle, area of a circle, volume of a cylinder, pyramid, and cone.',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.A',
    description: 'Explain volume formulas and use them to solve problems',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD',
    description: 'Geometric Measurement and Dimension',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.B.7',
    description: 'Use coordinates to compute perimeters of polygons and areas of triangles and rectangles, e.g., using the distance formula.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/B/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.B.6',
    description: 'Find the point on a directed line segment between two given points that partitions the segment in a given ratio.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.B.5',
    description: 'Prove the slope criteria for parallel and perpendicular lines and use them to solve geometric problems (e.g., find the equation of a line parallel or perpendicular to a given line that passes through a given point).',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.B.4',
    description: 'Use coordinates to prove simple geometric theorems algebraically.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.B',
    description: 'Use coordinates to prove simple geometric theorems algebraically',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.A.3',
    description: '(+) Derive the equations of ellipses and hyperbolas given the foci, using the fact that the sum or difference of distances from the foci is constant.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.A.2',
    description: 'Derive the equation of a parabola given a focus and directrix.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.A.1',
    description: 'Derive the equation of a circle of given center and radius using the Pythagorean Theorem; complete the square to find the center and radius of a circle given by an equation.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.A',
    description: 'Translate between the geometric description and the equation for a conic section',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE',
    description: 'Expressing Geometric Properties with Equations',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.B.5',
    description: 'Derive using similarity the fact that the length of the arc intercepted by an angle is proportional to the radius, and define the radian measure of the angle as the constant of proportionality; derive the formula for the area of a sector.',
    url: 'http://corestandards.org/Math/Content/HSG/C/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.B',
    description: 'Find arc lengths and areas of sectors of circles',
    url: 'http://corestandards.org/Math/Content/HSG/C/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.A.4',
    description: '(+) Construct a tangent line from a point outside a given circle to the circle.',
    url: 'http://corestandards.org/Math/Content/HSG/C/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.A.3',
    description: 'Construct the inscribed and circumscribed circles of a triangle, and prove properties of angles for a quadrilateral inscribed in a circle.',
    url: 'http://corestandards.org/Math/Content/HSG/C/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.A.2',
    description: 'Identify and describe relationships among inscribed angles, radii, and chords.',
    url: 'http://corestandards.org/Math/Content/HSG/C/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.A.1',
    description: 'Prove that all circles are similar.',
    url: 'http://corestandards.org/Math/Content/HSG/C/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.A',
    description: 'Understand and apply theorems about circles',
    url: 'http://corestandards.org/Math/Content/HSG/C/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C',
    description: 'Circles',
    url: 'http://corestandards.org/Math/Content/HSG/C/'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.D.11',
    description: '(+) Understand and apply the Law of Sines and the Law of Cosines to find unknown measurements in right and non-right triangles (e.g., surveying problems, resultant forces).',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/D/11'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.D.10',
    description: '(+) Prove the Laws of Sines and Cosines and use them to solve problems.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/D/10'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.D.9',
    description: '(+) Derive the formula A = 1/2 ab sin(C) for the area of a triangle by drawing an auxiliary line from a vertex perpendicular to the opposite side.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/D/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.D',
    description: 'Apply trigonometry to general triangles',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/D'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.C.8',
    description: 'Use trigonometric ratios and the Pythagorean Theorem to solve right triangles in applied problems.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.C.7',
    description: 'Explain and use the relationship between the sine and cosine of complementary angles.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.C.6',
    description: 'Understand that by similarity, side ratios in right triangles are properties of the angles in the triangle, leading to definitions of trigonometric ratios for acute angles.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.C',
    description: 'Define trigonometric ratios and solve problems involving right triangles',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.B.5',
    description: 'Use congruence and similarity criteria for triangles to solve problems and to prove relationships in geometric figures.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.B.4',
    description: 'Prove theorems about triangles.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.B',
    description: 'Prove theorems involving similarity',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.A.3',
    description: 'Use the properties of similarity transformations to establish the AA criterion for two triangles to be similar.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A/3'
  },
  {
    _id: ObjectId('5bb650e1fefbf3cf9e88f680'),
    identifier: 'CCSS.Math.Content.HSG.SRT.A.2',
    description: 'Given two figures, use the definition of similarity in terms of similarity transformations to decide if they are similar; explain using similarity transformations the meaning of similarity for triangles as the equality of all corresponding pairs of angles and the proportionality of all corresponding pairs of sides.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.A.1.b',
    description: 'The dilation of a line segment is longer or shorter in the ratio given by the scale factor.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A/1/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.A.1.a',
    description: 'A dilation takes a line not passing through the center of the dilation to a parallel line, and leaves a line passing through the center unchanged.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A/1/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.A.1',
    description: 'Verify experimentally the properties of dilations given by a center and a scale factor:',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.A',
    description: 'Understand similarity in terms of similarity transformations',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT',
    description: 'Similarity, Right Triangles, and Trigonometry',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.D.13',
    description: 'Construct an equilateral triangle, a square, and a regular hexagon inscribed in a circle.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/D/13'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.D.12',
    description: 'Make formal geometric constructions with a variety of tools and methods (compass and straightedge, string, reflective devices, paper folding, dynamic geometric software, etc.). Copying a segment; copying an angle; bisecting a segment; bisecting an angle; constructing perpendicular lines, including the perpendicular bisector of a line segment; and constructing a line parallel to a given line through a point not on the line.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/D/12'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.D',
    description: 'Make geometric constructions',
    url: 'http://corestandards.org/Math/Content/HSG/CO/D'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.C.11',
    description: 'Prove theorems about parallelograms.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/C/11'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.C.10',
    description: 'Prove theorems about triangles.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/C/10'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.C.9',
    description: 'Prove theorems about lines and angles.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/C/9'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.C',
    description: 'Prove geometric theorems',
    url: 'http://corestandards.org/Math/Content/HSG/CO/C'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.B.8',
    description: 'Explain how the criteria for triangle congruence (ASA, SAS, and SSS) follow from the definition of congruence in terms of rigid motions.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/B/8'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.B.7',
    description: 'Use the definition of congruence in terms of rigid motions to show that two triangles are congruent if and only if corresponding pairs of sides and corresponding pairs of angles are congruent.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/B/7'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.B.6',
    description: 'Use geometric descriptions of rigid motions to transform figures and to predict the effect of a given rigid motion on a given figure; given two figures, use the definition of congruence in terms of rigid motions to decide if they are congruent.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/B/6'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.B',
    description: 'Understand congruence in terms of rigid motions',
    url: 'http://corestandards.org/Math/Content/HSG/CO/B'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.A.5',
    description: 'Given a geometric figure and a rotation, reflection, or translation, draw the transformed figure using, e.g., graph paper, tracing paper, or geometry software. Specify a sequence of transformations that will carry a given figure onto another.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A/5'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.A.4',
    description: 'Develop definitions of rotations, reflections, and translations in terms of angles, circles, perpendicular lines, parallel lines, and line segments.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A/4'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.A.3',
    description: 'Given a rectangle, parallelogram, trapezoid, or regular polygon, describe the rotations and reflections that carry it onto itself.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A/3'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.A.2',
    description: 'Represent transformations in the plane using, e.g., transparencies and geometry software; describe transformations as functions that take points in the plane as inputs and give other points as outputs. Compare transformations that preserve distance and angle to those that do not (e.g., translation versus horizontal stretch).',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.A.1',
    description: 'Know precise definitions of angle, circle, perpendicular line, parallel line, and line segment, based on the undefined notions of point, line, distance along a line, and distance around a circular arc.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO.A',
    description: 'Experiment with transformations in the plane',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A'
  }, {
    identifier: 'CCSS.Math.Content.HSG.CO',
    description: 'Congruence',
    url: 'http://corestandards.org/Math/Content/HSG/CO'
  }, {
    identifier: 'CCSS.Math.Content.HSG',
    description: 'High School — Geometry',
    url: 'http://corestandards.org/Math/Content/HSG'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.C.9',
    description: '(+) Prove the addition and subtraction formulas for sine, cosine, and tangent and use them to solve problems.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/C/9'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.C.8',
    description: 'Prove the Pythagorean identity sin²(θ) + cos²(θ) = 1 and use it to find sin(θ), cos(θ), or tan(θ) given sin(θ), cos(θ), or tan(θ) and the quadrant of the angle.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/C/8'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.C',
    description: 'Prove and apply trigonometric identities',
    url: 'http://corestandards.org/Math/Content/HSF/TF/C'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.B.7',
    description: '(+) Use inverse functions to solve trigonometric equations that arise in modeling contexts; evaluate the solutions using technology, and interpret them in terms of the context.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/B/7'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.B.6',
    description: '(+) Understand that restricting a trigonometric function to a domain on which it is always increasing or always decreasing allows its inverse to be constructed.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/B/6'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.B.5',
    description: 'Choose trigonometric functions to model periodic phenomena with specified amplitude, frequency, and midline.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/B/5'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.B',
    description: 'Model periodic phenomena with trigonometric functions',
    url: 'http://corestandards.org/Math/Content/HSF/TF/B'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.A.4',
    description: '(+) Use the unit circle to explain symmetry (odd and even) and periodicity of trigonometric functions.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/A/4'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.A.3',
    description: '(+) Use special triangles to determine geometrically the values of sine, cosine, tangent for π/3, π/4 and π/6, and use the unit circle to express the values of sine, cosine, and tangent for π-x, π+x, and 2π-x in terms of their values for x, where x is any real number.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/A/3'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.A.2',
    description: 'Explain how the unit circle in the coordinate plane enables the extension of trigonometric functions to all real numbers, interpreted as radian measures of angles traversed counterclockwise around the unit circle.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.A.1',
    description: 'Understand radian measure of an angle as the length of the arc on the unit circle subtended by the angle.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF.A',
    description: 'Extend the domain of trigonometric functions using the unit circle',
    url: 'http://corestandards.org/Math/Content/HSF/TF/A'
  }, {
    identifier: 'CCSS.Math.Content.HSF.TF',
    description: 'Trigonometric Functions',
    url: 'http://corestandards.org/Math/Content/HSF/TF'
  }, {
    identifier: 'CCSS.Math.Content.HSF.LE.B.5',
    description: 'Interpret the parameters in a linear or exponential function in terms of a context.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/B/5'
  }, {
    identifier: 'CCSS.Math.Content.HSF.LE.B',
    description: 'Interpret expressions for functions in terms of the situation they model',
    url: 'http://corestandards.org/Math/Content/HSF/LE/B'
  }, {
    identifier: 'CCSS.Math.Content.HSF.LE.A.4',
    description: 'For exponential models, express as a logarithm the solution to ab<sup>ct</sup> = d where a, c, and d are numbers and the base b is 2, 10, or e; evaluate the logarithm using technology.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/4'
  }, {
    identifier: 'CCSS.Math.Content.HSF.LE.A.3',
    description: 'Observe using graphs and tables that a quantity increasing exponentially eventually exceeds a quantity increasing linearly, quadratically, or (more generally) as a polynomial function.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/3'
  }, {
    identifier: 'CCSS.Math.Content.HSF.LE.A.2',
    description: 'Construct linear and exponential functions, including arithmetic and geometric sequences, given a graph, a description of a relationship, or two input-output pairs (include reading these from a table).',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSF.LE.A.1.c',
    description: 'Recognize situations in which a quantity grows or decays by a constant percent rate per unit interval relative to another.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/1/c'
  }, {
    identifier: 'CCSS.Math.Content.HSF.LE.A.1.b',
    description: 'Recognize situations in which one quantity changes at a constant rate per unit interval relative to another.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/1/b'
  }, {
    identifier: 'CCSS.Math.Content.HSF.LE.A.1.a',
    description: 'Prove that linear functions grow by equal differences over equal intervals, and that exponential functions grow by equal factors over equal intervals.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/1/a'
  }, {
    identifier: 'CCSS.Math.Content.HSF.LE.A.1',
    description: 'Distinguish between situations that can be modeled with linear functions and with exponential functions.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSF.LE.A',
    description: 'Construct and compare linear, quadratic, and exponential models and solve problems',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A'
  }, {
    identifier: 'CCSS.Math.Content.HSF.LE',
    description: 'Linear, Quadratic, and Exponential Models',
    url: 'http://corestandards.org/Math/Content/HSF/LE/'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.B.5',
    description: '(+) Understand the inverse relationship between exponents and logarithms and use this relationship to solve problems involving logarithms and exponents.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/5'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.B.4.d',
    description: '(+) Produce an invertible function from a non-invertible function by restricting the domain.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/4/d'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.B.4.c',
    description: '(+) Read values of an inverse function from a graph or a table, given that the function has an inverse.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/4/c'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.B.4.b',
    description: '(+) Verify by composition that one function is the inverse of another.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/4/b'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.B.4.a',
    description: 'Solve an equation of the form f(x) = c for a simple function f that has an inverse and write an expression for the inverse.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/4/a'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.B.4',
    description: 'Find inverse functions.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/4'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.B.3',
    description: 'Identify the effect on the graph of replacing f(x) by f(x) + k, k f(x), f(kx), and f(x + k) for specific values of k (both positive and negative); find the value of k given the graphs. Experiment with cases and illustrate an explanation of the effects on the graph using technology. Include recognizing even and odd functions from their graphs and algebraic expressions for them.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/3'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.B',
    description: 'Build new functions from existing functions',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.A.2',
    description: 'Write arithmetic and geometric sequences both recursively and with an explicit formula, use them to model situations, and translate between the two forms.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.A.1.c',
    description: '(+) Compose functions.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A/1/c'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.A.1.b',
    description: 'Combine standard function types using arithmetic operations.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A/1/b'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.A.1.a',
    description: 'Determine an explicit expression, a recursive process, or steps for calculation from a context.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A/1/a'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.A.1',
    description: 'Write a function that describes a relationship between two quantities',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF.A',
    description: 'Build a function that models a relationship between two quantities',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A'
  }, {
    identifier: 'CCSS.Math.Content.HSF.BF',
    description: 'Building Functions',
    url: 'http://corestandards.org/Math/Content/HSF/BF/'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.C.9',
    description: 'Compare properties of two functions each represented in a different way (algebraically, graphically, numerically in tables, or by verbal descriptions).',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/9'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.C.8.b',
    description: 'Use the properties of exponents to interpret expressions for exponential functions.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/8/b'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.C.8.a',
    description: 'Use the process of factoring and completing the square in a quadratic function to show zeros, extreme values, and symmetry of the graph, and interpret these in terms of a context.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/8/a'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.C.8',
    description: 'Write a function defined by an expression in different but equivalent forms to reveal and explain different properties of the function.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/8'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7.e',
    description: 'Graph exponential and logarithmic functions, showing intercepts and end behavior, and trigonometric functions, showing period, midline, and amplitude.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7/e'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7.d',
    description: '(+) Graph rational functions, identifying zeros and asymptotes when suitable factorizations are available, and showing end behavior.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7/d'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7.c',
    description: 'Graph polynomial functions, identifying zeros when suitable factorizations are available, and showing end behavior.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7/c'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7.b',
    description: 'Graph square root, cube root, and piecewise-defined functions, including step functions and absolute value functions.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7/b'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7.a',
    description: 'Graph linear and quadratic functions and show intercepts, maxima, and minima.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7/a'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7',
    description: 'Graph functions expressed symbolically and show key features of the graph, by hand in simple cases and using technology for more complicated cases.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.C',
    description: 'Analyze functions using different representations',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.B.6',
    description: 'Calculate and interpret the average rate of change of a function (presented symbolically or as a table) over a specified interval. Estimate the rate of change from a graph.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/B/6'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.B.5',
    description: 'Relate the domain of a function to its graph and, where applicable, to the quantitative relationship it describes.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/B/5'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.B.4',
    description: 'For a function that models a relationship between two quantities, interpret key features of graphs and tables in terms of the quantities, and sketch graphs showing key features given a verbal description of the relationship.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/B/4'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.B',
    description: 'Interpret functions that arise in applications in terms of the context',
    url: 'http://corestandards.org/Math/Content/HSF/IF/B'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.A.3',
    description: 'Recognize that sequences are functions, sometimes defined recursively, whose domain is a subset of the integers.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/A/3'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.A.2',
    description: 'Use function notation, evaluate functions for inputs in their domains, and interpret statements that use function notation in terms of a context.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.A.1',
    description: 'Understand that a function from one set (called the domain) to another set (called the range) assigns to each element of the domain exactly one element of the range. If f is a function and x is an element of its domain, then f(x) denotes the output of f corresponding to the input x. The graph of f is the graph of the equation y = f(x).',
    url: 'http://corestandards.org/Math/Content/HSF/IF/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF.A',
    description: 'Understand the concept of a function and use function notation',
    url: 'http://corestandards.org/Math/Content/HSF/IF/A'
  }, {
    identifier: 'CCSS.Math.Content.HSF.IF',
    description: 'Interpreting Functions',
    url: 'http://corestandards.org/Math/Content/HSF/IF/'
  }, {
    identifier: 'CCSS.Math.Content.HSF',
    description: 'High School — Functions',
    url: 'http://corestandards.org/Math/Content/HSF/'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.D.12',
    description: 'Graph the solutions to a linear inequality in two variables as a half-plane (excluding the boundary in the case of a strict inequality), and graph the solution set to a system of linear inequalities in two variables as the intersection of the corresponding half-planes.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/D/12'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.D.11',
    description: 'Explain why the x-coordinates of the points where the graphs of the equations y = f(x) and y = g(x) intersect are the solutions of the equation f(x) = g(x); find the solutions approximately, e.g., using technology to graph the functions, make tables of values, or find successive approximations. Include cases where f(x) and/or g(x) are linear, polynomial, rational, absolute value, exponential, and logarithmic functions.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/D/11'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.D.10',
    description: 'Understand that the graph of an equation in two variables is the set of all its solutions plotted in the coordinate plane, often forming a curve (which could be a line).',
    url: 'http://corestandards.org/Math/Content/HSA/REI/D/10'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.D',
    description: 'Represent and solve equations and inequalities graphically',
    url: 'http://corestandards.org/Math/Content/HSA/REI/D'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.C.9',
    description: '(+) Find the inverse of a matrix if it exists and use it to solve systems of linear equations (using technology for matrices of dimension 3 × 3 or greater).',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C/9'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.C.8',
    description: '(+) Represent a system of linear equations as a single matrix equation in a vector variable.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C/8'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.C.7',
    description: 'Solve a simple system consisting of a linear equation and a quadratic equation in two variables algebraically and graphically.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C/7'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.C.6',
    description: 'Solve systems of linear equations exactly and approximately (e.g., with graphs), focusing on pairs of linear equations in two variables.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C/6'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.C.5',
    description: 'Prove that, given a system of two equations in two variables, replacing one equation by the sum of that equation and a multiple of the other produces a system with the same solutions.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C/5'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.C',
    description: 'Solve systems of equations',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.B.4.b',
    description: 'Solve quadratic equations by inspection (e.g., for x² = 49), taking square roots, completing the square, the quadratic formula and factoring, as appropriate to the initial form of the equation. Recognize when the quadratic formula gives complex solutions and write them as a ± bi for real numbers a and b.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/B/4/b'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.B.4.a',
    description: 'Use the method of completing the square to transform any quadratic equation in x into an equation of the form (x - p)² = q that has the same solutions. Derive the quadratic formula from this form.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/B/4/a'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.B.4',
    description: 'Solve quadratic equations in one variable.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/B/4'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.B.3',
    description: 'Solve linear equations and inequalities in one variable, including equations with coefficients represented by letters.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/B/3'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.B',
    description: 'Solve equations and inequalities in one variable',
    url: 'http://corestandards.org/Math/Content/HSA/REI/B'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.A.2',
    description: 'Solve simple rational and radical equations in one variable, and give examples showing how extraneous solutions may arise.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.A.1',
    description: 'Explain each step in solving a simple equation as following from the equality of numbers asserted at the previous step, starting from the assumption that the original equation has a solution. Construct a viable argument to justify a solution method.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI.A',
    description: 'Understand solving equations as a process of reasoning and explain the reasoning',
    url: 'http://corestandards.org/Math/Content/HSA/REI/A'
  }, {
    identifier: 'CCSS.Math.Content.HSA.REI',
    description: 'Reasoning with Equations and Inequalities',
    url: 'http://corestandards.org/Math/Content/HSA/REI/'
  }, {
    identifier: 'CCSS.Math.Content.HSA.CED.A.4',
    description: 'Rearrange formulas to highlight a quantity of interest, using the same reasoning as in solving equations.',
    url: 'http://corestandards.org/Math/Content/HSA/CED/A/4'
  }, {
    identifier: 'CCSS.Math.Content.HSA.CED.A.3',
    description: 'Represent constraints by equations or inequalities, and by systems of equations and/or inequalities, and interpret solutions as viable or nonviable options in a modeling context.',
    url: 'http://corestandards.org/Math/Content/HSA/CED/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.CED.A.2',
    description: 'Create equations in two or more variables to represent relationships between quantities; graph equations on coordinate axes with labels and scales.',
    url: 'http://corestandards.org/Math/Content/HSA/CED/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSA.CED.A.1',
    description: 'Create equations and inequalities in one variable and use them to solve problems. Include equations arising from linear and quadratic functions, and simple rational and exponential functions.',
    url: 'http://corestandards.org/Math/Content/HSA/CED/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSA.CED.A',
    description: 'Create equations that describe numbers or relationships',
    url: 'http://corestandards.org/Math/Content/HSA/CED/A'
  }, {
    identifier: 'CCSS.Math.Content.HSA.CED',
    description: 'Creating Equations',
    url: 'http://corestandards.org/Math/Content/HSA/CED/'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR.D.7',
    description: '(+) Understand that rational expressions form a system analogous to the rational numbers, closed under addition, subtraction, multiplication, and division by a nonzero rational expression; add, subtract, multiply, and divide rational expressions.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/D/7'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR.D.6',
    description: 'Rewrite simple rational expressions in different forms; write <sup>a(x </sup>/<sub>b(x)</sub> in the form q(x) + <sup>r(x)</sup>/<sub>b(x)</sub>, where a(x), b(x), q(x), and r(x) are polynomials with the degree of r(x) less than the degree of b(x), using inspection, long division, or, for the more complicated examples, a computer algebra system.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/D/6'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR.D',
    description: 'Rewrite rational expressions',
    url: 'http://corestandards.org/Math/Content/HSA/APR/D'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR.C.5',
    description: '(+) Know and apply the Binomial Theorem for the expansion of (x + y)<sup>n</sup> in powers of x and y for a positive integer n, where x and y are any numbers, with coefficients determined for example by Pascal\'s Triangle.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/C/5'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR.C.4',
    description: 'Prove polynomial identities and use them to describe numerical relationships.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/C/4'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR.C',
    description: 'Use polynomial identities to solve problems',
    url: 'http://corestandards.org/Math/Content/HSA/APR/C'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR.B.3',
    description: 'Identify zeros of polynomials when suitable factorizations are available, and use the zeros to construct a rough graph of the function defined by the polynomial.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/B/3'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR.B.2',
    description: 'Know and apply the Remainder Theorem: For a polynomial p(x) and a number a, the remainder on division by x - a is p(a), so p(a) = 0 if and only if (x - a) is a factor of p(x).',
    url: 'http://corestandards.org/Math/Content/HSA/APR/B/2'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR.B',
    description: 'Understand the relationship between zeros and factors of polynomials',
    url: 'http://corestandards.org/Math/Content/HSA/APR/B'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR.A.1',
    description: 'Understand that polynomials form a system analogous to the integers, namely, they are closed under the operations of addition, subtraction, and multiplication; add, subtract, and multiply polynomials.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR.A',
    description: 'Perform arithmetic operations on polynomials',
    url: 'http://corestandards.org/Math/Content/HSA/APR/A'
  }, {
    identifier: 'CCSS.Math.Content.HSA.APR',
    description: 'Arithmetic with Polynomials and Rational Expressions',
    url: 'http://corestandards.org/Math/Content/HSA/APR'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE.B.4',
    description: 'Derive the formula for the sum of a finite geometric series (when the common ratio is not 1), and use the formula to solve problems.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B/4'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE.B.3.c',
    description: 'Use the properties of exponents to transform expressions for exponential functions.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B/3/c'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE.B.3.b',
    description: 'Complete the square in a quadratic expression to reveal the maximum or minimum value of the function it defines.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B/3/b'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE.B.3.a',
    description: 'Factor a quadratic expression to reveal the zeros of the function it defines.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B/3/a'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE.B.3',
    description: 'Choose and produce an equivalent form of an expression to reveal and explain properties of the quantity represented by the expression.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B/3'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE.B',
    description: 'Write expressions in equivalent forms to solve problems',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE.A.2',
    description: 'Use the structure of an expression to identify ways to rewrite it.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE.A.1.b',
    description: 'Interpret complicated expressions by viewing one or more of their parts as a single entity.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/A/1/b'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE.A.1.a',
    description: 'Interpret parts of an expression, such as terms, factors, and coefficients.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/A/1/a'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE.A.1',
    description: 'Interpret expressions that represent a quantity in terms of its context',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE.A',
    description: 'Interpret the structure of expressions',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/A'
  }, {
    identifier: 'CCSS.Math.Content.HSA.SSE',
    description: 'Seeing Structure in Expressions',
    url: 'http://corestandards.org/Math/Content/HSA/SSE'
  }, {
    identifier: 'CCSS.Math.Content.HSA',
    description: 'High School — Algebra',
    url: 'http://corestandards.org/Math/Content/HSA'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.C.12',
    description: '(+) Work with 2 × 2 matrices as transformations of the plane, and interpret the absolute value of the determinant in terms of area.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/12'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.C.11',
    description: '(+) Multiply a vector (regarded as a matrix with one column) by a matrix of suitable dimensions to produce another vector. Work with matrices as transformations of vectors.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/11'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.C.10',
    description: '(+) Understand that the zero and identity matrices play a role in matrix addition and multiplication similar to the role of 0 and 1 in the real numbers. The determinant of a square matrix is nonzero if and only if the matrix has a multiplicative inverse.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/10'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.C.9',
    description: '(+) Understand that, unlike multiplication of numbers, matrix multiplication for square matrices is not a commutative operation, but still satisfies the associative and distributive properties.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/9'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.C.8',
    description: '(+) Add, subtract, and multiply matrices of appropriate dimensions.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/8'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.C.7',
    description: '(+) Multiply matrices by scalars to produce new matrices, e.g., as when all of the payoffs in a game are doubled.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/7'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.C.6',
    description: '(+) Use matrices to represent and manipulate data, e.g., to represent payoffs or incidence relationships in a network.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/6'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.C',
    description: 'Perform operations on matrices and use matrices in applications.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.B.5.b',
    description: 'Compute the magnitude of a scalar multiple cv using ||cv|| = |c|v. Compute the direction of cv knowing that when |c|v ? 0, the direction of cv is either along v (for c > 0) or against v (for c < 0).',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/5/b'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.B.5.a',
    description: 'Represent scalar multiplication graphically by scaling vectors and possibly reversing their direction; perform scalar multiplication component-wise, e.g., as c(v<sub>x</sub>, v<sub>y</sub>) = (cv<sub>x</sub>, cv<sub>y</sub>).',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/5/a'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.B.5',
    description: '(+) Multiply a vector by a scalar.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/5'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.B.4.c',
    description: 'Understand vector subtraction v - w as v + (-w), where -w is the additive inverse of w, with the same magnitude as w and pointing in the opposite direction. Represent vector subtraction graphically by connecting the tips in the appropriate order, and perform vector subtraction component-wise.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/4/c'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.B.4.b',
    description: 'Given two vectors in magnitude and direction form, determine the magnitude and direction of their sum.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/4/b'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.B.4.a',
    description: 'Add vectors end-to-end, component-wise, and by the parallelogram rule. Understand that the magnitude of a sum of two vectors is typically not the sum of the magnitudes.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/4/a'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.B.4',
    description: '(+) Add and subtract vectors.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/4'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.B',
    description: 'Perform operations on vectors.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.A.3',
    description: '(+) Solve problems involving velocity and other quantities that can be represented by vectors.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/A/3'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.A.2',
    description: '(+) Find the components of a vector by subtracting the coordinates of an initial point from the coordinates of a terminal point.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.A.1',
    description: '(+) Recognize vector quantities as having both magnitude and direction. Represent vector quantities by directed line segments, and use appropriate symbols for vectors and their magnitudes (e.g., v, |v|, ||v||, v).',
    url: 'http://corestandards.org/Math/Content/HSN/VM/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM.A',
    description: 'Represent and model with vector quantities.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/A'
  }, {
    identifier: 'CCSS.Math.Content.HSN.VM',
    description: 'Vector and Matrix Quantities',
    url: 'http://corestandards.org/Math/Content/HSN/VM/'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.C.9',
    description: '(+) Know the Fundamental Theorem of Algebra; show that it is true for quadratic polynomials.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/C/9'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.C.8',
    description: '(+) Extend polynomial identities to the complex numbers.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/C/8'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.C.7',
    description: 'Solve quadratic equations with real coefficients that have complex solutions.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/C/7'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.C',
    description: 'Use complex numbers in polynomial identities and equations.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/C'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.B.6',
    description: '(+) Calculate the distance between numbers in the complex plane as the modulus of the difference, and the midpoint of a segment as the average of the numbers at its endpoints.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/B/6'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.B.5',
    description: '(+) Represent addition, subtraction, multiplication, and conjugation of complex numbers geometrically on the complex plane; use properties of this representation for computation.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/B/5'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.B.4',
    description: '(+) Represent complex numbers on the complex plane in rectangular and polar form (including real and imaginary numbers), and explain why the rectangular and polar forms of a given complex number represent the same number.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/B/4'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.B',
    description: 'Represent complex numbers and their operations on the complex plane.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/B'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.A.3',
    description: '(+) Find the conjugate of a complex number; use conjugates to find moduli and quotients of complex numbers.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/A/3'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.A.2',
    description: 'Use the relation i² = -1 and the commutative, associative, and distributive properties to add, subtract, and multiply complex numbers.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.A.1',
    description: 'Know there is a complex number i such that i² = -1, and every complex number has the form a + bi with a and b real.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN.A',
    description: 'Perform arithmetic operations with complex numbers.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/A'
  }, {
    identifier: 'CCSS.Math.Content.HSN.CN',
    description: 'The Complex Number System',
    url: 'http://corestandards.org/Math/Content/HSN/CN!'
  }, {
    identifier: 'CCSS.Math.Content.HSN.Q.A.3',
    description: 'Choose a level of accuracy appropriate to limitations on measurement when reporting quantities.',
    url: 'http://corestandards.org/Math/Content/HSN/Q/A/3'
  }, {
    identifier: 'CCSS.Math.Content.HSN.Q.A.2',
    description: 'Define appropriate quantities for the purpose of descriptive modeling.',
    url: 'http://corestandards.org/Math/Content/HSN/Q/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSN.Q.A.1',
    description: 'Use units as a way to understand problems and to guide the solution of multi-step problems; choose and interpret units consistently in formulas; choose and interpret the scale and the origin in graphs and data displays.',
    url: 'http://corestandards.org/Math/Content/HSN/Q/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSN.Q.A',
    description: 'Reason quantitatively and use units to solve problems.',
    url: 'http://corestandards.org/Math/Content/HSN/Q/A'
  }, {
    identifier: 'CCSS.Math.Content.HSN.Q',
    description: 'Quantities',
    url: 'http://corestandards.org/Math/Content/HSN/Q/'
  }, {
    identifier: 'CCSS.Math.Content.HSN.RN.B.3',
    description: 'Explain why the sum or product of two rational numbers is rational; that the sum of a rational number and an irrational number is irrational; and that the product of a nonzero rational number and an irrational number is irrational.',
    url: 'http://corestandards.org/Math/Content/HSN/RN/B/3'
  }, {
    identifier: 'CCSS.Math.Content.HSN.RN.B',
    description: 'Use properties of rational and irrational numbers.',
    url: 'http://corestandards.org/Math/Content/HSN/RN/B'
  }, {
    identifier: 'CCSS.Math.Content.HSN.RN.A.2',
    description: 'Rewrite expressions involving radicals and rational exponents using the properties of exponents.',
    url: 'http://corestandards.org/Math/Content/HSN/RN/A/2'
  }, {
    identifier: 'CCSS.Math.Content.HSN.RN.A.1',
    description: 'Explain how the definition of the meaning of rational exponents follows from extending the properties of integer exponents to those values, allowing for a notation for radicals in terms of rational exponents.',
    url: 'http://corestandards.org/Math/Content/HSN/RN/A/1'
  }, {
    identifier: 'CCSS.Math.Content.HSN.RN.A',
    description: 'Extend the properties of exponents to rational exponents.',
    url: 'http://corestandards.org/Math/Content/HSN/RN/A'
  }, {
    identifier: 'CCSS.Math.Content.HSN.RN',
    description: 'The Real Number System',
    url: 'http://corestandards.org/Math/Content/HSN/RN/'
  }, {
    identifier: 'CCSS.Math.Content.HSN',
    description: 'High School — Number and Quantity',
    url: 'http://corestandards.org/Math/Content/HSN/'
  },
];

var gradeHSAlgebra = [
  {
    identifier: 'CCSS.Math.Content.HSA.REI.D.12',
    description: 'Graph the solutions to a linear inequality in two variables as a half-plane (excluding the boundary in the case of a strict inequality), and graph the solution set to a system of linear inequalities in two variables as the intersection of the corresponding half-planes.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/D/12'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.D.11',
    description: 'Explain why the x-coordinates of the points where the graphs of the equations y = f(x) and y = g(x) intersect are the solutions of the equation f(x) = g(x); find the solutions approximately, e.g., using technology to graph the functions, make tables of values, or find successive approximations. Include cases where f(x) and/or g(x) are linear, polynomial, rational, absolute value, exponential, and logarithmic functions.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/D/11'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.D.10',
    description: 'Understand that the graph of an equation in two variables is the set of all its solutions plotted in the coordinate plane, often forming a curve (which could be a line).',
    url: 'http://corestandards.org/Math/Content/HSA/REI/D/10'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.D',
    description: 'Represent and solve equations and inequalities graphically',
    url: 'http://corestandards.org/Math/Content/HSA/REI/D'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.C.9',
    description: '(+) Find the inverse of a matrix if it exists and use it to solve systems of linear equations (using technology for matrices of dimension 3 × 3 or greater).',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.C.8',
    description: '(+) Represent a system of linear equations as a single matrix equation in a vector variable.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.C.7',
    description: 'Solve a simple system consisting of a linear equation and a quadratic equation in two variables algebraically and graphically.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.C.6',
    description: 'Solve systems of linear equations exactly and approximately (e.g., with graphs), focusing on pairs of linear equations in two variables.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.C.5',
    description: 'Prove that, given a system of two equations in two variables, replacing one equation by the sum of that equation and a multiple of the other produces a system with the same solutions.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.C',
    description: 'Solve systems of equations',
    url: 'http://corestandards.org/Math/Content/HSA/REI/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.B.4.b',
    description: 'Solve quadratic equations by inspection (e.g., for x² = 49), taking square roots, completing the square, the quadratic formula and factoring, as appropriate to the initial form of the equation. Recognize when the quadratic formula gives complex solutions and write them as a ± bi for real numbers a and b.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/B/4/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.B.4.a',
    description: 'Use the method of completing the square to transform any quadratic equation in x into an equation of the form (x - p)² = q that has the same solutions. Derive the quadratic formula from this form.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/B/4/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.B.4',
    description: 'Solve quadratic equations in one variable.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.B.3',
    description: 'Solve linear equations and inequalities in one variable, including equations with coefficients represented by letters.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.B',
    description: 'Solve equations and inequalities in one variable',
    url: 'http://corestandards.org/Math/Content/HSA/REI/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.A.2',
    description: 'Solve simple rational and radical equations in one variable, and give examples showing how extraneous solutions may arise.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.A.1',
    description: 'Explain each step in solving a simple equation as following from the equality of numbers asserted at the previous step, starting from the assumption that the original equation has a solution. Construct a viable argument to justify a solution method.',
    url: 'http://corestandards.org/Math/Content/HSA/REI/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI.A',
    description: 'Understand solving equations as a process of reasoning and explain the reasoning',
    url: 'http://corestandards.org/Math/Content/HSA/REI/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.REI',
    description: 'Reasoning with Equations and Inequalities',
    url: 'http://corestandards.org/Math/Content/HSA/REI/'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.CED.A.4',
    description: 'Rearrange formulas to highlight a quantity of interest, using the same reasoning as in solving equations.',
    url: 'http://corestandards.org/Math/Content/HSA/CED/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.CED.A.3',
    description: 'Represent constraints by equations or inequalities, and by systems of equations and/or inequalities, and interpret solutions as viable or nonviable options in a modeling context.',
    url: 'http://corestandards.org/Math/Content/HSA/CED/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.CED.A.2',
    description: 'Create equations in two or more variables to represent relationships between quantities; graph equations on coordinate axes with labels and scales.',
    url: 'http://corestandards.org/Math/Content/HSA/CED/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.CED.A.1',
    description: 'Create equations and inequalities in one variable and use them to solve problems. Include equations arising from linear and quadratic functions, and simple rational and exponential functions.',
    url: 'http://corestandards.org/Math/Content/HSA/CED/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.CED.A',
    description: 'Create equations that describe numbers or relationships',
    url: 'http://corestandards.org/Math/Content/HSA/CED/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.CED',
    description: 'Creating Equations',
    url: 'http://corestandards.org/Math/Content/HSA/CED'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR.D.7',
    description: '(+) Understand that rational expressions form a system analogous to the rational numbers, closed under addition, subtraction, multiplication, and division by a nonzero rational expression; add, subtract, multiply, and divide rational expressions.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/D/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR.D.6',
    description: 'Rewrite simple rational expressions in different forms; write <sup>a(x </sup>/<sub>b(x)</sub> in the form q(x) + <sup>r(x)</sup>/<sub>b(x)</sub>, where a(x), b(x), q(x), and r(x) are polynomials with the degree of r(x) less than the degree of b(x), using inspection, long division, or, for the more complicated examples, a computer algebra system.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/D/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR.D',
    description: 'Rewrite rational expressions',
    url: 'http://corestandards.org/Math/Content/HSA/APR/D'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR.C.5',
    description: '(+) Know and apply the Binomial Theorem for the expansion of (x + y)<sup>n</sup> in powers of x and y for a positive integer n, where x and y are any numbers, with coefficients determined for example by Pascal\'s Triangle.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/C/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR.C.4',
    description: 'Prove polynomial identities and use them to describe numerical relationships.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/C/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR.C',
    description: 'Use polynomial identities to solve problems',
    url: 'http://corestandards.org/Math/Content/HSA/APR/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR.B.3',
    description: 'Identify zeros of polynomials when suitable factorizations are available, and use the zeros to construct a rough graph of the function defined by the polynomial.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR.B.2',
    description: 'Know and apply the Remainder Theorem: For a polynomial p(x) and a number a, the remainder on division by x - a is p(a), so p(a) = 0 if and only if (x - a) is a factor of p(x).',
    url: 'http://corestandards.org/Math/Content/HSA/APR/B/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR.B',
    description: 'Understand the relationship between zeros and factors of polynomials',
    url: 'http://corestandards.org/Math/Content/HSA/APR/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR.A.1',
    description: 'Understand that polynomials form a system analogous to the integers, namely, they are closed under the operations of addition, subtraction, and multiplication; add, subtract, and multiply polynomials.',
    url: 'http://corestandards.org/Math/Content/HSA/APR/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR.A',
    description: 'Perform arithmetic operations on polynomials',
    url: 'http://corestandards.org/Math/Content/HSA/APR/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.APR',
    description: 'Arithmetic with Polynomials and Rational Expressions',
    url: 'http://corestandards.org/Math/Content/HSA/APR/'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE.B.4',
    description: 'Derive the formula for the sum of a finite geometric series (when the common ratio is not 1), and use the formula to solve problems.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE.B.3.c',
    description: 'Use the properties of exponents to transform expressions for exponential functions.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B/3/c'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE.B.3.b',
    description: 'Complete the square in a quadratic expression to reveal the maximum or minimum value of the function it defines.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B/3/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE.B.3.a',
    description: 'Factor a quadratic expression to reveal the zeros of the function it defines.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B/3/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE.B.3',
    description: 'Choose and produce an equivalent form of an expression to reveal and explain properties of the quantity represented by the expression.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE.B',
    description: 'Write expressions in equivalent forms to solve problems',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE.A.2',
    description: 'Use the structure of an expression to identify ways to rewrite it.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE.A.1.b',
    description: 'Interpret complicated expressions by viewing one or more of their parts as a single entity.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/A/1/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE.A.1.a',
    description: 'Interpret parts of an expression, such as terms, factors, and coefficients.',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/A/1/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE.A.1',
    description: 'Interpret expressions that represent a quantity in terms of its context',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE.A',
    description: 'Interpret the structure of expressions',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSA.SSE',
    description: 'Seeing Structure in Expressions',
    url: 'http://corestandards.org/Math/Content/HSA/SSE/'
  },
];

var gradeHSFunctions = [
  {
    identifier: 'CCSS.Math.Content.HSF.TF.C.9',
    description: '(+) Prove the addition and subtraction formulas for sine, cosine, and tangent and use them to solve problems.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/C/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF.C.8',
    description: 'Prove the Pythagorean identity sin²(θ) + cos²(θ) = 1 and use it to find sin(θ), cos(θ), or tan(θ) given sin(θ), cos(θ), or tan(θ) and the quadrant of the angle.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF.C',
    description: 'Prove and apply trigonometric identities',
    url: 'http://corestandards.org/Math/Content/HSF/TF/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF.B.7',
    description: '(+) Use inverse functions to solve trigonometric equations that arise in modeling contexts; evaluate the solutions using technology, and interpret them in terms of the context.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/B/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF.B.6',
    description: '(+) Understand that restricting a trigonometric function to a domain on which it is always increasing or always decreasing allows its inverse to be constructed.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF.B.5',
    description: 'Choose trigonometric functions to model periodic phenomena with specified amplitude, frequency, and midline.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF.B',
    description: 'Model periodic phenomena with trigonometric functions',
    url: 'http://corestandards.org/Math/Content/HSF/TF/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF.A.4',
    description: '(+) Use the unit circle to explain symmetry (odd and even) and periodicity of trigonometric functions.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF.A.3',
    description: '(+) Use special triangles to determine geometrically the values of sine, cosine, tangent for π/3, π/4 and π/6, and use the unit circle to express the values of sine, cosine, and tangent for π-x, π+x, and 2π-x in terms of their values for x, where x is any real number.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF.A.2',
    description: 'Explain how the unit circle in the coordinate plane enables the extension of trigonometric functions to all real numbers, interpreted as radian measures of angles traversed counterclockwise around the unit circle.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF.A.1',
    description: 'Understand radian measure of an angle as the length of the arc on the unit circle subtended by the angle.',
    url: 'http://corestandards.org/Math/Content/HSF/TF/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF.A',
    description: 'Extend the domain of trigonometric functions using the unit circle',
    url: 'http://corestandards.org/Math/Content/HSF/TF/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.TF',
    description: 'Trigonometric Functions',
    url: 'http://corestandards.org/Math/Content/HSF/TF/'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.LE.B.5',
    description: 'Interpret the parameters in a linear or exponential function in terms of a context.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.LE.B',
    description: 'Interpret expressions for functions in terms of the situation they model',
    url: 'http://corestandards.org/Math/Content/HSF/LE/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.LE.A.4',
    description: 'For exponential models, express as a logarithm the solution to ab<sup>ct</sup> = d where a, c, and d are numbers and the base b is 2, 10, or e; evaluate the logarithm using technology.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.LE.A.3',
    description: 'Observe using graphs and tables that a quantity increasing exponentially eventually exceeds a quantity increasing linearly, quadratically, or (more generally) as a polynomial function.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.LE.A.2',
    description: 'Construct linear and exponential functions, including arithmetic and geometric sequences, given a graph, a description of a relationship, or two input-output pairs (include reading these from a table).',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.LE.A.1.c',
    description: 'Recognize situations in which a quantity grows or decays by a constant percent rate per unit interval relative to another.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/1/c'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.LE.A.1.b',
    description: 'Recognize situations in which one quantity changes at a constant rate per unit interval relative to another.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/1/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.LE.A.1.a',
    description: 'Prove that linear functions grow by equal differences over equal intervals, and that exponential functions grow by equal factors over equal intervals.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/1/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.LE.A.1',
    description: 'Distinguish between situations that can be modeled with linear functions and with exponential functions.',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.LE.A',
    description: 'Construct and compare linear, quadratic, and exponential models and solve problems',
    url: 'http://corestandards.org/Math/Content/HSF/LE/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.LE',
    description: 'Linear, Quadratic, and Exponential Models',
    url: 'http://corestandards.org/Math/Content/HSF/LE/'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.B.5',
    description: '(+) Understand the inverse relationship between exponents and logarithms and use this relationship to solve problems involving logarithms and exponents.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.B.4.d',
    description: '(+) Produce an invertible function from a non-invertible function by restricting the domain.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/4/d'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.B.4.c',
    description: '(+) Read values of an inverse function from a graph or a table, given that the function has an inverse.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/4/c'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.B.4.b',
    description: '(+) Verify by composition that one function is the inverse of another.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/4/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.B.4.a',
    description: 'Solve an equation of the form f(x) = c for a simple function f that has an inverse and write an expression for the inverse.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/4/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.B.4',
    description: 'Find inverse functions.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.B.3',
    description: 'Identify the effect on the graph of replacing f(x) by f(x) + k, k f(x), f(kx), and f(x + k) for specific values of k (both positive and negative); find the value of k given the graphs. Experiment with cases and illustrate an explanation of the effects on the graph using technology. Include recognizing even and odd functions from their graphs and algebraic expressions for them.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.B',
    description: 'Build new functions from existing functions',
    url: 'http://corestandards.org/Math/Content/HSF/BF/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.A.2',
    description: 'Write arithmetic and geometric sequences both recursively and with an explicit formula, use them to model situations, and translate between the two forms.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.A.1.c',
    description: '(+) Compose functions.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A/1/c'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.A.1.b',
    description: 'Combine standard function types using arithmetic operations.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A/1/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.A.1.a',
    description: 'Determine an explicit expression, a recursive process, or steps for calculation from a context.',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A/1/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.A.1',
    description: 'Write a function that describes a relationship between two quantities',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF.A',
    description: 'Build a function that models a relationship between two quantities',
    url: 'http://corestandards.org/Math/Content/HSF/BF/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.BF',
    description: 'Building Functions',
    url: 'http://corestandards.org/Math/Content/HSF/BF/'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.C.9',
    description: 'Compare properties of two functions each represented in a different way (algebraically, graphically, numerically in tables, or by verbal descriptions).',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.C.8.b',
    description: 'Use the properties of exponents to interpret expressions for exponential functions.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/8/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.C.8.a',
    description: 'Use the process of factoring and completing the square in a quadratic function to show zeros, extreme values, and symmetry of the graph, and interpret these in terms of a context.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/8/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.C.8',
    description: 'Write a function defined by an expression in different but equivalent forms to reveal and explain different properties of the function.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7.e',
    description: 'Graph exponential and logarithmic functions, showing intercepts and end behavior, and trigonometric functions, showing period, midline, and amplitude.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7/e'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7.d',
    description: '(+) Graph rational functions, identifying zeros and asymptotes when suitable factorizations are available, and showing end behavior.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7/d'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7.c',
    description: 'Graph polynomial functions, identifying zeros when suitable factorizations are available, and showing end behavior.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7/c'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7.b',
    description: 'Graph square root, cube root, and piecewise-defined functions, including step functions and absolute value functions.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7.a',
    description: 'Graph linear and quadratic functions and show intercepts, maxima, and minima.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.C.7',
    description: 'Graph functions expressed symbolically and show key features of the graph, by hand in simple cases and using technology for more complicated cases.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.C',
    description: 'Analyze functions using different representations',
    url: 'http://corestandards.org/Math/Content/HSF/IF/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.B.6',
    description: 'Calculate and interpret the average rate of change of a function (presented symbolically or as a table) over a specified interval. Estimate the rate of change from a graph.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.B.5',
    description: 'Relate the domain of a function to its graph and, where applicable, to the quantitative relationship it describes.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.B.4',
    description: 'For a function that models a relationship between two quantities, interpret key features of graphs and tables in terms of the quantities, and sketch graphs showing key features given a verbal description of the relationship.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.B',
    description: 'Interpret functions that arise in applications in terms of the context',
    url: 'http://corestandards.org/Math/Content/HSF/IF/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.A.3',
    description: 'Recognize that sequences are functions, sometimes defined recursively, whose domain is a subset of the integers.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.A.2',
    description: 'Use function notation, evaluate functions for inputs in their domains, and interpret statements that use function notation in terms of a context.',
    url: 'http://corestandards.org/Math/Content/HSF/IF/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.A.1',
    description: 'Understand that a function from one set (called the domain) to another set (called the range) assigns to each element of the domain exactly one element of the range. If f is a function and x is an element of its domain, then f(x) denotes the output of f corresponding to the input x. The graph of f is the graph of the equation y = f(x).',
    url: 'http://corestandards.org/Math/Content/HSF/IF/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF.A',
    description: 'Understand the concept of a function and use function notation',
    url: 'http://corestandards.org/Math/Content/HSF/IF/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSF.IF',
    description: 'Interpreting Functions',
    url: 'http://corestandards.org/Math/Content/HSF/IF/'
  },
];

var gradeHsGeometry = [
  {
    identifier: 'CCSS.Math.Content.HSG.MG.A.3',
    description: 'Apply geometric methods to solve design problems (e.g., designing an object or structure to satisfy physical constraints or minimize cost; working with typographic grid systems based on ratios).',
    url: 'http://corestandards.org/Math/Content/HSG/MG/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.MG.A.2',
    description: 'Apply concepts of density based on area and volume in modeling situations (e.g., persons per square mile, BTUs per cubic foot).',
    url: 'http://corestandards.org/Math/Content/HSG/MG/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.MG.A.1',
    description: 'Use geometric shapes, their measures, and their properties to describe objects (e.g., modeling a tree trunk or a human torso as a cylinder).',
    url: 'http://corestandards.org/Math/Content/HSG/MG/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.MG.A',
    description: 'Apply geometric concepts in modeling situations',
    url: 'http://corestandards.org/Math/Content/HSG/MG/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.MG',
    description: 'Modeling with Geometry',
    url: 'http://corestandards.org/Math/Content/HSG/MG/'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.B.4',
    description: 'Identify the shapes of two-dimensional cross-sections of three-dimensional objects, and identify three-dimensional objects generated by rotations of two-dimensional objects.',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.B',
    description: 'Visualize relationships between two-dimensional and three-dimensional objects',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.A.3',
    description: 'Use volume formulas for cylinders, pyramids, cones, and spheres to solve problems.',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.A.2',
    description: '(+) Give an informal argument using Cavalieri\'s principle for the formulas for the volume of a sphere and other solid figures.',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.A.1',
    description: 'Give an informal argument for the formulas for the circumference of a circle, area of a circle, volume of a cylinder, pyramid, and cone.',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD.A',
    description: 'Explain volume formulas and use them to solve problems',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GMD',
    description: 'Geometric Measurement and Dimension',
    url: 'http://corestandards.org/Math/Content/HSG/GMD/'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.B.7',
    description: 'Use coordinates to compute perimeters of polygons and areas of triangles and rectangles, e.g., using the distance formula.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/B/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.B.6',
    description: 'Find the point on a directed line segment between two given points that partitions the segment in a given ratio.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.B.5',
    description: 'Prove the slope criteria for parallel and perpendicular lines and use them to solve geometric problems (e.g., find the equation of a line parallel or perpendicular to a given line that passes through a given point).',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.B.4',
    description: 'Use coordinates to prove simple geometric theorems algebraically.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.B',
    description: 'Use coordinates to prove simple geometric theorems algebraically',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.A.3',
    description: '(+) Derive the equations of ellipses and hyperbolas given the foci, using the fact that the sum or difference of distances from the foci is constant.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.A.2',
    description: 'Derive the equation of a parabola given a focus and directrix.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.A.1',
    description: 'Derive the equation of a circle of given center and radius using the Pythagorean Theorem; complete the square to find the center and radius of a circle given by an equation.',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE.A',
    description: 'Translate between the geometric description and the equation for a conic section',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.GPE',
    description: 'Expressing Geometric Properties with Equations',
    url: 'http://corestandards.org/Math/Content/HSG/GPE/'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.B.5',
    description: 'Derive using similarity the fact that the length of the arc intercepted by an angle is proportional to the radius, and define the radian measure of the angle as the constant of proportionality; derive the formula for the area of a sector.',
    url: 'http://corestandards.org/Math/Content/HSG/C/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.B',
    description: 'Find arc lengths and areas of sectors of circles',
    url: 'http://corestandards.org/Math/Content/HSG/C/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.A.4',
    description: '(+) Construct a tangent line from a point outside a given circle to the circle.',
    url: 'http://corestandards.org/Math/Content/HSG/C/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.A.3',
    description: 'Construct the inscribed and circumscribed circles of a triangle, and prove properties of angles for a quadrilateral inscribed in a circle.',
    url: 'http://corestandards.org/Math/Content/HSG/C/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.A.2',
    description: 'Identify and describe relationships among inscribed angles, radii, and chords.',
    url: 'http://corestandards.org/Math/Content/HSG/C/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.A.1',
    description: 'Prove that all circles are similar.',
    url: 'http://corestandards.org/Math/Content/HSG/C/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C.A',
    description: 'Understand and apply theorems about circles',
    url: 'http://corestandards.org/Math/Content/HSG/C/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.C',
    description: 'Circles',
    url: 'http://corestandards.org/Math/Content/HSG/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.D.11',
    description: '(+) Understand and apply the Law of Sines and the Law of Cosines to find unknown measurements in right and non-right triangles (e.g., surveying problems, resultant forces).',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/D/11'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.D.10',
    description: '(+) Prove the Laws of Sines and Cosines and use them to solve problems.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/D/10'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.D.9',
    description: '(+) Derive the formula A = 1/2 ab sin(C) for the area of a triangle by drawing an auxiliary line from a vertex perpendicular to the opposite side.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/D/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.D',
    description: 'Apply trigonometry to general triangles',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/D'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.C.8',
    description: 'Use trigonometric ratios and the Pythagorean Theorem to solve right triangles in applied problems.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.C.7',
    description: 'Explain and use the relationship between the sine and cosine of complementary angles.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.C.6',
    description: 'Understand that by similarity, side ratios in right triangles are properties of the angles in the triangle, leading to definitions of trigonometric ratios for acute angles.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.C',
    description: 'Define trigonometric ratios and solve problems involving right triangles',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.B.5',
    description: 'Use congruence and similarity criteria for triangles to solve problems and to prove relationships in geometric figures.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.B.4',
    description: 'Prove theorems about triangles.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.B',
    description: 'Prove theorems involving similarity',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.A.3',
    description: 'Use the properties of similarity transformations to establish the AA criterion for two triangles to be similar.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.A.2',
    description: 'Given two figures, use the definition of similarity in terms of similarity transformations to decide if they are similar; explain using similarity transformations the meaning of similarity for triangles as the equality of all corresponding pairs of angles and the proportionality of all corresponding pairs of sides.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.A.1.b',
    description: 'The dilation of a line segment is longer or shorter in the ratio given by the scale factor.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A/1/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.A.1.a',
    description: 'A dilation takes a line not passing through the center of the dilation to a parallel line, and leaves a line passing through the center unchanged.',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A/1/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.A.1',
    description: 'Verify experimentally the properties of dilations given by a center and a scale factor:',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT.A',
    description: 'Understand similarity in terms of similarity transformations',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.SRT',
    description: 'Similarity, Right Triangles, and Trigonometry',
    url: 'http://corestandards.org/Math/Content/HSG/SRT/'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.D.13',
    description: 'Construct an equilateral triangle, a square, and a regular hexagon inscribed in a circle.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/D/13'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.D.12',
    description: 'Make formal geometric constructions with a variety of tools and methods (compass and straightedge, string, reflective devices, paper folding, dynamic geometric software, etc.). Copying a segment; copying an angle; bisecting a segment; bisecting an angle; constructing perpendicular lines, including the perpendicular bisector of a line segment; and constructing a line parallel to a given line through a point not on the line.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/D/12'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.D',
    description: 'Make geometric constructions',
    url: 'http://corestandards.org/Math/Content/HSG/CO/D'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.C.11',
    description: 'Prove theorems about parallelograms.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/C/11'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.C.10',
    description: 'Prove theorems about triangles.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/C/10'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.C.9',
    description: 'Prove theorems about lines and angles.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/C/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.C',
    description: 'Prove geometric theorems',
    url: 'http://corestandards.org/Math/Content/HSG/CO/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.B.8',
    description: 'Explain how the criteria for triangle congruence (ASA, SAS, and SSS) follow from the definition of congruence in terms of rigid motions.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/B/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.B.7',
    description: 'Use the definition of congruence in terms of rigid motions to show that two triangles are congruent if and only if corresponding pairs of sides and corresponding pairs of angles are congruent.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/B/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.B.6',
    description: 'Use geometric descriptions of rigid motions to transform figures and to predict the effect of a given rigid motion on a given figure; given two figures, use the definition of congruence in terms of rigid motions to decide if they are congruent.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.B',
    description: 'Understand congruence in terms of rigid motions',
    url: 'http://corestandards.org/Math/Content/HSG/CO/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.A.5',
    description: 'Given a geometric figure and a rotation, reflection, or translation, draw the transformed figure using, e.g., graph paper, tracing paper, or geometry software. Specify a sequence of transformations that will carry a given figure onto another.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.A.4',
    description: 'Develop definitions of rotations, reflections, and translations in terms of angles, circles, perpendicular lines, parallel lines, and line segments.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.A.3',
    description: 'Given a rectangle, parallelogram, trapezoid, or regular polygon, describe the rotations and reflections that carry it onto itself.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.A.2',
    description: 'Represent transformations in the plane using, e.g., transparencies and geometry software; describe transformations as functions that take points in the plane as inputs and give other points as outputs. Compare transformations that preserve distance and angle to those that do not (e.g., translation versus horizontal stretch).',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.A.1',
    description: 'Know precise definitions of angle, circle, perpendicular line, parallel line, and line segment, based on the undefined notions of point, line, distance along a line, and distance around a circular arc.',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO.A',
    description: 'Experiment with transformations in the plane',
    url: 'http://corestandards.org/Math/Content/HSG/CO/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSG.CO',
    description: 'Congruence',
    url: 'http://corestandards.org/Math/Content/HSG/CO/'
  },
];

var gradeHSNumber = [
  {
    identifier: 'CCSS.Math.Content.HSN.VM.C.12',
    description: '(+) Work with 2 × 2 matrices as transformations of the plane, and interpret the absolute value of the determinant in terms of area.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/12'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.C.11',
    description: '(+) Multiply a vector (regarded as a matrix with one column) by a matrix of suitable dimensions to produce another vector. Work with matrices as transformations of vectors.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/11'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.C.10',
    description: '(+) Understand that the zero and identity matrices play a role in matrix addition and multiplication similar to the role of 0 and 1 in the real numbers. The determinant of a square matrix is nonzero if and only if the matrix has a multiplicative inverse.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/10'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.C.9',
    description: '(+) Understand that, unlike multiplication of numbers, matrix multiplication for square matrices is not a commutative operation, but still satisfies the associative and distributive properties.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.C.8',
    description: '(+) Add, subtract, and multiply matrices of appropriate dimensions.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.C.7',
    description: '(+) Multiply matrices by scalars to produce new matrices, e.g., as when all of the payoffs in a game are doubled.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.C.6',
    description: '(+) Use matrices to represent and manipulate data, e.g., to represent payoffs or incidence relationships in a network.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.C',
    description: 'Perform operations on matrices and use matrices in applications.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.B.5.b',
    description: 'Compute the magnitude of a scalar multiple cv using ||cv|| = |c|v. Compute the direction of cv knowing that when |c|v ? 0, the direction of cv is either along v (for c > 0) or against v (for c < 0).',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/5/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.B.5.a',
    description: 'Represent scalar multiplication graphically by scaling vectors and possibly reversing their direction; perform scalar multiplication component-wise, e.g., as c(v<sub>x</sub>, v<sub>y</sub>) = (cv<sub>x</sub>, cv<sub>y</sub>).',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/5/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.B.5',
    description: '(+) Multiply a vector by a scalar.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.B.4.c',
    description: 'Understand vector subtraction v - w as v + (-w), where -w is the additive inverse of w, with the same magnitude as w and pointing in the opposite direction. Represent vector subtraction graphically by connecting the tips in the appropriate order, and perform vector subtraction component-wise.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/4/c'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.B.4.b',
    description: 'Given two vectors in magnitude and direction form, determine the magnitude and direction of their sum.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/4/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.B.4.a',
    description: 'Add vectors end-to-end, component-wise, and by the parallelogram rule. Understand that the magnitude of a sum of two vectors is typically not the sum of the magnitudes.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/4/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.B.4',
    description: '(+) Add and subtract vectors.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.B',
    description: 'Perform operations on vectors.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.A.3',
    description: '(+) Solve problems involving velocity and other quantities that can be represented by vectors.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.A.2',
    description: '(+) Find the components of a vector by subtracting the coordinates of an initial point from the coordinates of a terminal point.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.A.1',
    description: '(+) Recognize vector quantities as having both magnitude and direction. Represent vector quantities by directed line segments, and use appropriate symbols for vectors and their magnitudes (e.g., v, |v|, ||v||, v).',
    url: 'http://corestandards.org/Math/Content/HSN/VM/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM.A',
    description: 'Represent and model with vector quantities.',
    url: 'http://corestandards.org/Math/Content/HSN/VM/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.VM',
    description: 'Vector and Matrix Quantities',
    url: 'http://corestandards.org/Math/Content/HSN/VM'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.C.9',
    description: '(+) Know the Fundamental Theorem of Algebra; show that it is true for quadratic polynomials.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/C/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.C.8',
    description: '(+) Extend polynomial identities to the complex numbers.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.C.7',
    description: 'Solve quadratic equations with real coefficients that have complex solutions.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.C',
    description: 'Use complex numbers in polynomial identities and equations.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.B.6',
    description: '(+) Calculate the distance between numbers in the complex plane as the modulus of the difference, and the midpoint of a segment as the average of the numbers at its endpoints.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.B.5',
    description: '(+) Represent addition, subtraction, multiplication, and conjugation of complex numbers geometrically on the complex plane; use properties of this representation for computation.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.B.4',
    description: '(+) Represent complex numbers on the complex plane in rectangular and polar form (including real and imaginary numbers), and explain why the rectangular and polar forms of a given complex number represent the same number.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.B',
    description: 'Represent complex numbers and their operations on the complex plane.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.A.3',
    description: '(+) Find the conjugate of a complex number; use conjugates to find moduli and quotients of complex numbers.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.A.2',
    description: 'Use the relation i² = -1 and the commutative, associative, and distributive properties to add, subtract, and multiply complex numbers.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.A.1',
    description: 'Know there is a complex number i such that i² = -1, and every complex number has the form a + bi with a and b real.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN.A',
    description: 'Perform arithmetic operations with complex numbers.',
    url: 'http://corestandards.org/Math/Content/HSN/CN/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.CN',
    description: 'The Complex Number System',
    url: 'http://corestandards.org/Math/Content/HSN/CN/'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.Q.A.3',
    description: 'Choose a level of accuracy appropriate to limitations on measurement when reporting quantities.',
    url: 'http://corestandards.org/Math/Content/HSN/Q/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.Q.A.2',
    description: 'Define appropriate quantities for the purpose of descriptive modeling.',
    url: 'http://corestandards.org/Math/Content/HSN/Q/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.Q.A.1',
    description: 'Use units as a way to understand problems and to guide the solution of multi-step problems; choose and interpret units consistently in formulas; choose and interpret the scale and the origin in graphs and data displays.',
    url: 'http://corestandards.org/Math/Content/HSN/Q/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.Q.A',
    description: 'Reason quantitatively and use units to solve problems.',
    url: 'http://corestandards.org/Math/Content/HSN/Q/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.Q',
    description: 'Quantities',
    url: 'http://corestandards.org/Math/Content/HSN/Q/'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.RN.B.3',
    description: 'Explain why the sum or product of two rational numbers is rational; that the sum of a rational number and an irrational number is irrational; and that the product of a nonzero rational number and an irrational number is irrational.',
    url: 'http://corestandards.org/Math/Content/HSN/RN/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.RN.B',
    description: 'Use properties of rational and irrational numbers.',
    url: 'http://corestandards.org/Math/Content/HSN/RN/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.RN.A.2',
    description: 'Rewrite expressions involving radicals and rational exponents using the properties of exponents.',
    url: 'http://corestandards.org/Math/Content/HSN/RN/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.RN.A.1',
    description: 'Explain how the definition of the meaning of rational exponents follows from extending the properties of integer exponents to those values, allowing for a notation for radicals in terms of rational exponents.',
    url: 'http://corestandards.org/Math/Content/HSN/RN/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.RN.A',
    description: 'Extend the properties of exponents to rational exponents.',
    url: 'http://corestandards.org/Math/Content/HSN/RN/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSN.RN',
    description: 'The Real Number System',
    url: 'http://corestandards.org/Math/Content/HSN/RN/'
  },
];

var gradeHSProbability = [
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B.7',
    description: '(+) Analyze decisions and strategies using probability concepts (e.g., product testing, medical testing, pulling a hockey goalie at the end of a game).',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B.6',
    description: '(+) Use probabilities to make fair decisions (e.g., drawing by lots, using a random number generator).',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B.5.b',
    description: 'Evaluate and compare strategies on the basis of expected values.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B/5/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B.5.a',
    description: 'Find the expected payoff for a game of chance.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B/5/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B.5',
    description: '(+) Weigh the possible outcomes of a decision by assigning probabilities to payoff values and finding expected values.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.B',
    description: 'Use probability to evaluate outcomes of decisions',
    url: 'http://corestandards.org/Math/Content/HSS/MD/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.A.4',
    description: '(+) Develop a probability distribution for a random variable defined for a sample space in which probabilities are assigned empirically; find the expected value.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.A.3',
    description: '(+) Develop a probability distribution for a random variable defined for a sample space in which theoretical probabilities can be calculated; find the expected value.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.A.2',
    description: '(+) Calculate the expected value of a random variable; interpret it as the mean of the probability distribution.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.A.1',
    description: '(+) Define a random variable for a quantity of interest by assigning a numerical value to each event in a sample space; graph the corresponding probability distribution using the same graphical displays as for data distributions.',
    url: 'http://corestandards.org/Math/Content/HSS/MD/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD.A',
    description: 'Calculate expected values and use them to solve problems',
    url: 'http://corestandards.org/Math/Content/HSS/MD/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.MD',
    description: 'Using Probability to Make Decisions',
    url: 'http://corestandards.org/Math/Content/HSS/MD/'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.B.9',
    description: '(+) Use permutations and combinations to compute probabilities of compound events and solve problems.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/B/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.B.8',
    description: '(+) Apply the general Multiplication Rule in a uniform probability model, P(A and B) = P(A)P(B|A) = P(B)P(A|B), and interpret the answer in terms of the model.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/B/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.B.7',
    description: 'Apply the Addition Rule, P(A or B) = P(A) + P(B) - P(A and B), and interpret the answer in terms of the model.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/B/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.B.6',
    description: 'Find the conditional probability of A given B as the fraction of B\'s outcomes that also belong to A, and interpret the answer in terms of the model.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.B',
    description: 'Use the rules of probability to compute probabilities of compound events in a uniform probability model',
    url: 'http://corestandards.org/Math/Content/HSS/CP/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A.5',
    description: 'Recognize and explain the concepts of conditional probability and independence in everyday language and everyday situations.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A.4',
    description: 'Construct and interpret two-way frequency tables of data when two categories are associated with each object being classified. Use the two-way table as a sample space to decide if events are independent and to approximate conditional probabilities.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A.3',
    description: 'Understand the conditional probability of A given B as P(A and B)/P(B), and interpret independence of A and B as saying that the conditional probability of A given B is the same as the probability of A, and the conditional probability of B given A is the same as the probability of B.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A.2',
    description: 'Understand that two events A and B are independent if the probability of A and B occurring together is the product of their probabilities, and use this characterization to determine if they are independent.',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A.1',
    description: 'Describe events as subsets of a sample space (the set of outcomes) using characteristics (or categories) of the outcomes, or as unions, intersections, or complements of other events ("or," "and," "not").',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP.A',
    description: 'Understand independence and conditional probability and use them to interpret data',
    url: 'http://corestandards.org/Math/Content/HSS/CP/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.CP',
    description: 'Conditional Probability and the Rules of Probability',
    url: 'http://corestandards.org/Math/Content/HSS/CP/'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.B.6',
    description: 'Evaluate reports based on data.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.B.5',
    description: 'Use data from a randomized experiment to compare two treatments; use simulations to decide if differences between parameters are significant.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.B.4',
    description: 'Use data from a sample survey to estimate a population mean or proportion; develop a margin of error through the use of simulation models for random sampling.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/B/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.B.3',
    description: 'Recognize the purposes of and differences among sample surveys, experiments, and observational studies; explain how randomization relates to each.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/B/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.B',
    description: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies',
    url: 'http://corestandards.org/Math/Content/HSS/IC/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.A.2',
    description: 'Decide if a specified model is consistent with results from a given data-generating process, e.g., using simulation.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.A.1',
    description: 'Understand statistics as a process for making inferences about population parameters based on a random sample from that population.',
    url: 'http://corestandards.org/Math/Content/HSS/IC/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC.A',
    description: 'Understand and evaluate random processes underlying statistical experiments',
    url: 'http://corestandards.org/Math/Content/HSS/IC/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.IC',
    description: 'Making Inferences and Justifying Conclusions',
    url: 'http://corestandards.org/Math/Content/HSS/IC/'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.C.9',
    description: 'Distinguish between correlation and causation.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/C/9'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.C.8',
    description: 'Compute (using technology) and interpret the correlation coefficient of a linear fit.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/C/8'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.C.7',
    description: 'Interpret the slope (rate of change) and the intercept (constant term) of a linear model in the context of the data.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/C/7'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.C',
    description: 'Interpret linear models',
    url: 'http://corestandards.org/Math/Content/HSS/ID/C'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B.6.c',
    description: 'Fit a linear function for a scatter plot that suggests a linear association.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B/6/c'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B.6.b',
    description: 'Informally assess the fit of a function by plotting and analyzing residuals.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B/6/b'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B.6.a',
    description: 'Fit a function to the data; use functions fitted to data to solve problems in the context of the data.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B/6/a'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B.6',
    description: 'Represent data on two quantitative variables on a scatter plot, and describe how the variables are related.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B/6'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B.5',
    description: 'Summarize categorical data for two categories in two-way frequency tables. Interpret relative frequencies in the context of the data (including joint, marginal, and conditional relative frequencies). Recognize possible associations and trends in the data.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B/5'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.B',
    description: 'Summarize, represent, and interpret data on two categorical and quantitative variables',
    url: 'http://corestandards.org/Math/Content/HSS/ID/B'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.A.4',
    description: 'Use the mean and standard deviation of a data set to fit it to a normal distribution and to estimate population percentages. Recognize that there are data sets for which such a procedure is not appropriate. Use calculators, spreadsheets, and tables to estimate areas under the normal curve.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/A/4'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.A.3',
    description: 'Interpret differences in shape, center, and spread in the context of the data sets, accounting for possible effects of extreme data points (outliers).',
    url: 'http://corestandards.org/Math/Content/HSS/ID/A/3'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.A.2',
    description: 'Use statistics appropriate to the shape of the data distribution to compare center (median, mean) and spread (interquartile range, standard deviation) of two or more different data sets.',
    url: 'http://corestandards.org/Math/Content/HSS/ID/A/2'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.A.1',
    description: 'Represent data with plots on the real number line (dot plots, histograms, and box plots).',
    url: 'http://corestandards.org/Math/Content/HSS/ID/A/1'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID.A',
    description: 'Summarize, represent, and interpret data on a single count or measurement variable',
    url: 'http://corestandards.org/Math/Content/HSS/ID/A'
  },
  {
    identifier: 'CCSS.Math.Content.HSS.ID',
    description: 'Interpreting Categorical and Quantitative Data',
    url: 'http://corestandards.org/Math/Content/HSS/ID/'
  },
];

var mathPractice = [
  {
    identifier: 'CCSS.Math.Practice.MP8',
    description: 'Look for and express regularity in repeated reasoning.',
    url: 'http://corestandards.org/Math/Practice/MP8'
  }, {
    identifier: 'CCSS.Math.Practice.MP7',
    description: 'Look for and make use of structure.',
    url: 'http://corestandards.org/Math/Practice/MP7'
  }, {
    identifier: 'CCSS.Math.Practice.MP6',
    description: 'Attend to precision.',
    url: 'http://corestandards.org/Math/Practice/MP6'
  }, {
    identifier: 'CCSS.Math.Practice.MP5',
    description: 'Use appropriate tools strategically.',
    url: 'http://corestandards.org/Math/Practice/MP5'
  }, {
    identifier: 'CCSS.Math.Practice.MP4',
    description: 'Model with mathematics.',
    url: 'http://corestandards.org/Math/Practice/MP4'
  }, {
    identifier: 'CCSS.Math.Practice.MP3',
    description: 'Construct viable arguments and critique the reasoning of others.',
    url: 'http://corestandards.org/Math/Practice/MP3'
  }, {
    identifier: 'CCSS.Math.Practice.MP2',
    description: 'Reason abstractly and quantitatively.',
    url: 'http://corestandards.org/Math/Practice/MP2'
  }, {
    identifier: 'CCSS.Math.Practice.MP1',
    description: 'Make sense of problems and persevere in solving them.',
    url: 'http://corestandards.org/Math/Practice/MP1'
  }, {
    identifier: 'CCSS.Math.Practice.MP',
    description: 'Standards for Mathematical Practice',
    url: 'http://www.corestandards.org/Math/Practice/'
  }, {
    identifier: 'CCSS.Math.Practice.MP1',
    description: "Mathematically proficient students start by explaining to themselves the meaning of a problem and looking for entry points to its solution. They analyze givens, constraints, relationships, and goals. They make conjectures about the form and meaning of the solution and plan a solution pathway rather than simply jumping into a solution attempt. They consider analogous problems, and try special cases and simpler forms of the original problem in order to gain insight into its solution. They monitor and evaluate their progress and change course if necessary. Older students might, depending on the context of the problem, transform algebraic expressions or change the viewing window on their graphing calculator to get the information they need. Mathematically proficient students can explain correspondences between equations, verbal descriptions, tables, and graphs or draw diagrams of important features and relationships, graph data, and search for regularity or trends. Younger students might rely on using concrete objects or pictures to help conceptualize and solve a problem. Mathematically proficient students check their answers to problems using a different method, and they continually ask themselves, \"Does this make sense?\" They can understand the approaches of others to solving complex problems and identify correspondences between different approaches.",
    url: "http://corestandards.org/Math/Practice/MP1"
  }, {
    "identifier": "CCSS.Math.Practice.MP2",
    "description": "Mathematically proficient students make sense of quantities and their relationships in problem situations. They bring two complementary abilities to bear on problems involving quantitative relationships: the ability to decontextualize—to abstract a given situation and represent it symbolically and manipulate the representing symbols as if they have a life of their own, without necessarily attending to their referents—and the ability to contextualize, to pause as needed during the manipulation process in order to probe into the referents for the symbols involved. Quantitative reasoning entails habits of creating a coherent representation of the problem at hand; considering the units involved; attending to the meaning of quantities, not just how to compute them; and knowing and flexibly using different properties of operations and objects.",
    "url": "http://corestandards.org/Math/Practice/MP2"
  }, {
    "identifier": "CCSS.Math.Practice.MP3",
    "description": "Mathematically proficient students understand and use stated assumptions, definitions, and previously established results in constructing arguments.They make conjectures and build a logical progression of statements to explore the truth of their conjectures.They are able to analyze situations by breaking them into cases, and can recognize and use counterexamples.They justify their conclusions, communicate them to others, and respond to the arguments of others.They reason inductively about data, making plausible arguments that take into account the context from which the data arose.Mathematically proficient students are also able to compare the effectiveness of two plausible arguments, distinguish correct logic or reasoning from that which is flawed, and if there is a flaw in an argument explain what it is.Elementary students can construct arguments using concrete referents such as objects, drawings, diagrams, and actions.Such arguments can make sense and be correct, even though they are not generalized or made formal until later grades.Later, students learn to determine domains to which an argument applies.Students at all grades can listen or read the arguments of others, decide whether they make sense, and ask useful questions to clarify or improve the arguments.",
    "url": "http://corestandards.org/Math/Practice/MP3"
  }, {
    "identifier": "CCSS.Math.Practice.MP4",
    "description": "Mathematically proficient students can apply the mathematics they know to solve problems arising in everyday life, society, and the workplace. In early grades, this might be as simple as writing an addition equation to describe a situation. In middle grades, a student might apply proportional reasoning to plan a school event or analyze a problem in the community. By high school, a student might use geometry to solve a design problem or use a function to describe how one quantity of interest depends on another. Mathematically proficient students who can apply what they know are comfortable making assumptions and approximations to simplify a complicated situation, realizing that these may need revision later. They are able to identify important quantities in a practical situation and map their relationships using such tools as diagrams, two-way tables, graphs, flowcharts and formulas. They can analyze those relationships mathematically to draw conclusions. They routinely interpret their mathematical results in the context of the situation and reflect on whether the results make sense, possibly improving the model if it has not served its purpose.",
    "url": "http://corestandards.org/Math/Practice/MP4"
  }, {
    "identifier": "CCSS.Math.Practice.MP5",
    "description": "Mathematically proficient students consider the available tools when solving a mathematical problem. These tools might include pencil and paper, concrete models, a ruler, a protractor, a calculator, a spreadsheet, a computer algebra system, a statistical package, or dynamic geometry software. Proficient students are sufficiently familiar with tools appropriate for their grade or course to make sound decisions about when each of these tools might be helpful, recognizing both the insight to be gained and their limitations. For example, mathematically proficient high school students analyze graphs of functions and solutions generated using a graphing calculator. They detect possible errors by strategically using estimation and other mathematical knowledge. When making mathematical models, they know that technology can enable them to visualize the results of varying assumptions, explore consequences, and compare predictions with data. Mathematically proficient students at various grade levels are able to identify relevant external mathematical resources, such as digital content located on a website, and use them to pose or solve problems. They are able to use technological tools to explore and deepen their understanding of concepts.",
    "url": "http://corestandards.org/Math/Practice/MP5"
  }, {
    "identifier": "CCSS.Math.Practice.MP6",
    "description": "Mathematically proficient students try to communicate precisely to others. They try to use clear definitions in discussion with others and in their own reasoning. They state the meaning of the symbols they choose, including using the equal sign consistently and appropriately. They are careful about specifying units of measure, and labeling axes to clarify the correspondence with quantities in a problem. They calculate accurately and efficiently, express numerical answers with a degree of precision appropriate for the problem context. In the elementary grades, students give carefully formulated explanations to each other. By the time they reach high school they have learned to examine claims and make explicit use of definitions.",
    "url": "http://corestandards.org/Math/Practice/MP6"
  }, {
    "identifier": "CCSS.Math.Practice.MP7",
    "description": "Mathematically proficient students look closely to discern a pattern or structure. Young students, for example, might notice that three and seven more is the same amount as seven and three more, or they may sort a collection of shapes according to how many sides the shapes have. Later, students will see 7 × 8 equals the well remembered 7 × 5 + 7 × 3, in preparation for learning about the distributive property. In the expression x2 + 9x + 14, older students can see the 14 as 2 × 7 and the 9 as 2 + 7. They recognize the significance of an existing line in a geometric figure and can use the strategy of drawing an auxiliary line for solving problems. They also can step back for an overview and shift perspective. They can see complicated things, such as some algebraic expressions, as single objects or as being composed of several objects. For example, they can see 5 - 3(x - y)2 as 5 minus a positive number times a square and use that to realize that its value cannot be more than 5 for any real numbers x and y.",
    "url": "http://corestandards.org/Math/Practice/MP7"
  }, {
    "identifier": "CCSS.Math.Practice.MP8",
    "description": "Mathematically proficient students notice if calculations are repeated, and look both for general methods and for shortcuts. Upper elementary students might notice when dividing 25 by 11 that they are repeating the same calculations over and over again, and conclude they have a repeating decimal. By paying attention to the calculation of slope as they repeatedly check whether points are on the line through (1, 2) with slope 3, middle school students might abstract the equation (y - 2)/(x - 1) = 3. Noticing the regularity in the way terms cancel when expanding (x - 1)(x + 1), (x - 1)(x2 + x + 1), and (x - 1)(x3 + x2 + x + 1) might lead them to the general formula for the sum of a geometric series. As they work to solve a problem, mathematically proficient students maintain oversight of the process, while attending to the details. They continually evaluate the reasonableness of their intermediate results.",
    "url": "http://corestandards.org/Math/Practice/MP8"
  },
  {
    "_id" : ObjectId("5bbdfc46ecd6e597fd8d7aa3"),
    "isTrashed" : true,
    "identifier": 'CCSS.Math.Practice.MP2'
}
];

var data = gradek.concat(gradek, grade1, grade2, grade3, grade4, grade5, grade6, grade7, grade8, gradeHSS, gradeHSAlgebra, gradeHSFunctions, gradeHsGeometry, gradeHSNumber, gradeHSProbability);

var nonDuplicated = _.uniq(data, 'identifier');

let list = nonDuplicated.concat(mathPractice);
module.exports = list;
// var CategoriesSeeder = Seeder.extend({
//   shouldRun: function () {
//     return Category.count().exec().then(count => count === 0);
//   },
//   run: function () {
//     return Category.create(list);
//   }
// });


// module.exports = CategoriesSeeder;