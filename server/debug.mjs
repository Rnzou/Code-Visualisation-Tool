import { spawn } from 'child_process';
import { GDB } from 'gdb-js';
import 'babel-polyfill';

async function startGDB() {
  let debugInfo = [];
  let threadsInfo = [];
  let child = spawn('gdb', ['-i=mi', '../build/temp']);
  let gdb = new GDB(child);

  gdb.on('stopped', (data) => {
    if (data.reason === 'breakpoint-hit') {
      console.log(data.breakpoint.id + ' is hit!');
    }
  });
  gdb.init();
  let currentThread = await gdb.currentThread();
  gdb.addBreak('temp.c', 'main');
  gdb.run();
  
  let pauseCondition = true;
  while (pauseCondition) {
    try {
      let context = await gdb.context(currentThread);
      let threads = await gdb.threads();
      if (context[0].name === "lock_free") {
        console.log("reaching the end");
        break;
      }

      let threadsTemp = threads.map(element => ({
        id: element.id,
        line: element.frame.line,
        func: element.frame.func
      }));
      let contextTemp = context.map(element => ({
        name: element.name,
        type: element.type,
        value: element.value
      }));
      
      threadsInfo.push(threadsTemp);
      debugInfo.push(contextTemp);

      gdb.stepIn(currentThread);
    } catch (error) {
      console.log(error);
      pauseCondition = false;
    }
  }

  
  await gdb.interrupt();
  return { debugInfo, threadsInfo };
  
}

export { startGDB };