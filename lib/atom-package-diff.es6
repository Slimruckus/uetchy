import chalk from 'chalk'
import * as apm from './apm'

export function cmdStatus(cmd, options) {
  var stats = getPackageStats();
  console.log(stats.installed.length + " packages installed")
  console.log(stats.starred.length + " packages starred")

  console.log(chalk.green("\n# Packages only in apm"));
  console.log(stats.only_in_apm.join(' '));

  console.log(chalk.green("\n# Packages only in local machine"));
  console.log(stats.only_in_local.join(' '));
}

export function cmdSync(cmd, options) {
  // Install only_in_apm
  // Star only_in_local
  var stats = getPackageStats();

  for (let pkg of stats.only_in_apm) {
    console.log(chalk.green("Installing ... ") + pkg);
    apm.install(pkg);
  }

  for (let pkg of stats.only_in_local) {
    console.log(chalk.green("Staring ... ") + pkg);
    apm.star(pkg);
  }
}

export function cmdSyncWithRemote(cmd, options) {
  // Uninstall only_in_local
  // Install only_in_apm
  var stats = getPackageStats();

  for (let pkg of stats.only_in_local) {
    console.log(chalk.red("Uninstalling ... ") + pkg);
    apm.uninstall(pkg);
  }

  for (let pkg of stats.only_in_apm) {
    console.log(chalk.green("Installing ... ") + pkg);
    apm.install(pkg);
  }
}

export function cmdSyncWithLocal(cmd, options) {
  // Unstar only_in_apm
  // Star only_in_local
  var stats = getPackageStats();

  for (let pkg of stats.only_in_apm) {
    console.log(chalk.red("Unstaring ... ") + pkg);
    apm.unstar(pkg);
  }

  for (let pkg of stats.only_in_local) {
    console.log(chalk.green("Staring ... ") + pkg);
    apm.star(pkg);
  }
}

function setOfName(arr) {
  return arr.map(function(s){
    return s.name
  })
}

function diff(a, b) {
  return a.filter(function(x){
    return b.indexOf(x) < 0
  })
}

function getPackageStats() {
  var installed = apm.installedPackages();
  var starred = apm.starredPackages();
  return {
    installed: installed,
    starred: starred,
    only_in_apm: diff( setOfName(starred) , setOfName(installed) ),
    only_in_local: diff( setOfName(installed) , setOfName(starred) )
  }
}