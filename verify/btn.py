from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':900,'height':700})
    pg.add_init_script("localStorage.setItem('python_academy_save', JSON.stringify({v:1,onboarded:true,xp:0,badges:[],badgeDates:{},stats:{},problems:{},lessons:{},streak:{cur:0,best:0,last:null},days:{},dailyGoal:5,dailyGoalDates:{},settings:{theme:'dark',font:1,sound:true,vibrate:true,anim:2,apiKey:'',model:'x',editorTheme:'classic',confetti:'rainbow',soundSet:'bell',accessory:'none',turtleSpeed:6},works:[],tutorChats:{},myProblems:[],bestTimes:{},dailyChallenge:null,checkups:{},playgroundXp:{date:'',amount:0},polished:{},examplesEdited:{},reviewToday:{date:'',count:0}}))")
    pg.goto('file:///home/claude/python_academy.html'); pg.wait_for_timeout(1500); pg.evaluate("Loader.minimized=true;Loader.render();UI.go('lesson',{lessonId:'L0',page:0})"); pg.wait_for_timeout(600)
    pg.locator('.lp-card').first.screenshot(path='/home/claude/verify/shot_btn.png'); b.close()
