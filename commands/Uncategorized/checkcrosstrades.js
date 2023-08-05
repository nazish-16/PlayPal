const fs = require('fs');
const { AttachmentBuilder } = require('discord.js')

exports.run = (client,message,args0) => {
    if(message.author.id === '564327207133249536'){
    const crosstradesFile = '/home/container/storeroom/crosstrades.txt';
    console.log("inside ctcheck file");
    const args = message.content.split(' ');
    if (args.length !== 3) {
      message.reply('Please provide the start and end dates in the format: DD/MM/YYYY');
      return;
    }
    const startDate = parseDate(args[1]);
    const endDate = parseDate(args[2]);
    if (!startDate || !endDate) {
      message.reply('Invalid date format. Please use the format: DD/MM/YYYY');
      return;
    }
    fs.readFile(crosstradesFile, 'utf8', (err, data) => {
      if (err) {
        message.reply('An error occurred while reading the crosstrades file.');
        console.error(err);
        return;
      }
      
      const crosstrades = data.split('\n');
      const filteredCrosstrades = crosstrades.filter((crosstrade) => {
        const [timeDate,link] = crosstrade.split('  ==> ');
        const [timestamp , dateStr]=timeDate.split(' ');

        if (!dateStr) {console.log(`${dateStr}`); return;}
        const crosstradeDate = parseDate(dateStr.trim());
        
        return crosstradeDate && crosstradeDate >= startDate && crosstradeDate <= endDate;
      });
      
      if (filteredCrosstrades.length === 0) {
        message.reply('No crosstrades found within the specified time duration.');
        return;
      }
      const output = filteredCrosstrades.join('\n');
      fs.writeFile('filtered_crosstrades.txt', output, (err) => {
        if (err) {
          message.reply('An error occurred while saving the filtered crosstrades file.');
          console.error(err);
          return;
        }
        const att = new AttachmentBuilder('./filtered_crosstrades.txt','filtered_crosstrades.txt')
        message.reply({content:`Filtered crosstrades saved successfully.`,files:[att]}).catch(error => console.error(error));
      });
    });

function parseDate(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; 
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  return new Date(year, month, day);
}
}}

exports.name = 'checkcrosstrades'