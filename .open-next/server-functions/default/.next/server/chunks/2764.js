exports.id=2764,exports.ids=[2764,4291],exports.modules={28646:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{K:()=>i});var e=c(30477),f=c(67939),g=a([f]);f=(g.then?(await g)():g)[0];class h{static getInstance(){return h.instance||(h.instance=new h),h.instance}async initialize(){await (0,f.P)(`
      CREATE TABLE IF NOT EXISTS notification_jobs (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        icon TEXT,
        badge TEXT,
        image TEXT,
        data JSONB,
        actions JSONB,
        tag VARCHAR(255),
        require_interaction BOOLEAN DEFAULT false,
        silent BOOLEAN DEFAULT false,
        vibrate INTEGER[],
        user_ids TEXT[],
        all_users BOOLEAN DEFAULT false,
        scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255) NOT NULL,
        attempts INTEGER DEFAULT 0,
        max_attempts INTEGER DEFAULT 3,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
        error TEXT,
        processed_at TIMESTAMP WITH TIME ZONE
      )
    `),await (0,f.P)("CREATE INDEX IF NOT EXISTS idx_notification_jobs_scheduled_time ON notification_jobs(scheduled_time)"),await (0,f.P)("CREATE INDEX IF NOT EXISTS idx_notification_jobs_status ON notification_jobs(status)"),await (0,f.P)("CREATE INDEX IF NOT EXISTS idx_notification_jobs_created_by ON notification_jobs(created_by)"),(0,e.fH)("Notification job queue initialized")}async addJob(a){let b=`notif_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,c=new Date;await (0,f.P)(`
      INSERT INTO notification_jobs (
        id, title, body, icon, badge, image, data, actions, tag,
        require_interaction, silent, vibrate, user_ids, all_users,
        scheduled_time, created_at, created_by, attempts, max_attempts, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    `,[b,a.title,a.body,a.icon,a.badge,a.image,a.data?JSON.stringify(a.data):null,a.actions?JSON.stringify(a.actions):null,a.tag,a.requireInteraction||!1,a.silent||!1,a.vibrate||null,a.userIds||null,a.allUsers||!1,a.scheduledTime,c,a.createdBy,0,a.maxAttempts||3,"pending"]),(0,e.fH)(`Added notification job ${b} scheduled for ${a.scheduledTime}`);try{this.startProcessor()}catch{}return b}async getReadyJobs(a=10){return(await (0,f.P)(`
      SELECT * FROM notification_jobs
      WHERE status = 'pending' 
        AND scheduled_time <= NOW()
        AND attempts < max_attempts
      ORDER BY scheduled_time ASC
      LIMIT $1
    `,[a])).rows.map(a=>({id:a.id,title:a.title,body:a.body,icon:a.icon,badge:a.badge,image:a.image,data:a.data?JSON.parse(a.data):void 0,actions:a.actions?JSON.parse(a.actions):void 0,tag:a.tag,requireInteraction:a.require_interaction,silent:a.silent,vibrate:a.vibrate,userIds:a.user_ids,allUsers:a.all_users,scheduledTime:new Date(a.scheduled_time),createdAt:new Date(a.created_at),createdBy:a.created_by,attempts:a.attempts,maxAttempts:a.max_attempts,status:a.status,error:a.error,processedAt:a.processed_at?new Date(a.processed_at):void 0}))}async markJobProcessing(a){await (0,f.P)(`
      UPDATE notification_jobs 
      SET status = 'processing', attempts = attempts + 1
      WHERE id = $1
    `,[a])}async markJobCompleted(a){await (0,f.P)(`
      UPDATE notification_jobs 
      SET status = 'completed', processed_at = NOW()
      WHERE id = $1
    `,[a]),this.lastProcessedAt=new Date}async markJobFailed(a,b){let c=(await (0,f.P)(`
      UPDATE notification_jobs 
      SET error = $2, processed_at = NOW(),
          status = CASE 
            WHEN attempts >= max_attempts THEN 'failed'
            ELSE 'pending'
          END
      WHERE id = $1
      RETURNING attempts, max_attempts
    `,[a,b])).rows[0];c&&c.attempts>=c.max_attempts?(0,e.vV)(`Job ${a} failed permanently after ${c.attempts} attempts`):(0,e.vV)(`Job ${a} failed, will retry. Attempt ${c?.attempts||0}/${c?.max_attempts||3}`),this.lastProcessedAt=new Date}async cancelJob(a){return(await (0,f.P)(`
      UPDATE notification_jobs 
      SET status = 'cancelled', processed_at = NOW()
      WHERE id = $1 AND status IN ('pending', 'processing')
      RETURNING id
    `,[a])).rows.length>0}async getStats(){let a=await (0,f.P)(`
      SELECT 
        status,
        COUNT(*) as count
      FROM notification_jobs
      GROUP BY status
    `),b={pending:0,processing:0,completed:0,failed:0,cancelled:0,total:0};return a.rows.forEach(a=>{let c=a.status;c in b&&"total"!==c&&(b[c]=parseInt(a.count),b.total+=parseInt(a.count))}),b}async getJobs(a,b=50,c=0,d){let e=[],g=[],h=1;a&&(e.push(`status = $${h}`),g.push(a),h++),d&&(e.push(`created_by = $${h}`),g.push(d),h++);let i=e.length>0?`WHERE ${e.join(" AND ")}`:"",j=await (0,f.P)(`
      SELECT COUNT(*) as total FROM notification_jobs ${i}
    `,g);return{jobs:(await (0,f.P)(`
      SELECT * FROM notification_jobs 
      ${i}
      ORDER BY created_at DESC
      LIMIT $${h} OFFSET $${h+1}
    `,[...g,b,c])).rows.map(a=>({id:a.id,title:a.title,body:a.body,icon:a.icon,badge:a.badge,image:a.image,data:a.data?JSON.parse(a.data):void 0,actions:a.actions?JSON.parse(a.actions):void 0,tag:a.tag,requireInteraction:a.require_interaction,silent:a.silent,vibrate:a.vibrate,userIds:a.user_ids,allUsers:a.all_users,scheduledTime:new Date(a.scheduled_time),createdAt:new Date(a.created_at),createdBy:a.created_by,attempts:a.attempts,maxAttempts:a.max_attempts,status:a.status,error:a.error,processedAt:a.processed_at?new Date(a.processed_at):void 0})),total:parseInt(j.rows[0].total)}}async cleanup(a=30){if("number"!=typeof a||a<0||a>365)throw Error("Invalid olderThanDays parameter: must be a number between 0 and 365");let b=(await (0,f.P)(`
      DELETE FROM notification_jobs 
      WHERE status IN ('completed', 'failed', 'cancelled')
        AND processed_at < NOW() - INTERVAL $1 || ' days'
      RETURNING id
    `,[a.toString()])).rows.length;return b>0&&(0,e.fH)(`Cleaned up ${b} old notification jobs`),b}startProcessor(a=3e4){if(this.processingInterval)return void(0,e.fH)("Job processor is already running");(0,e.fH)(`Starting notification job processor with ${a}ms interval`),this.processingInterval=setInterval(async()=>{if(this.isProcessing)return void(0,e.fH)("Skipping job processing - already in progress");try{let a=await this.processJobs();0===a?(this.idleCyclesWithoutWork+=1,this.idleCyclesWithoutWork>=this.IDLE_STOP_CYCLES&&((0,e.fH)("No jobs for a while; stopping notification job processor to save resources"),this.stopProcessor(),this.idleCyclesWithoutWork=0)):this.idleCyclesWithoutWork=0}catch(a){(0,e.vV)("Job processing error:",a)}},a)}stopProcessor(){this.processingInterval&&(clearInterval(this.processingInterval),this.processingInterval=null,(0,e.fH)("Job processor stopped"))}async processJobs(){if(!this.isProcessing){this.isProcessing=!0;try{let a=await this.getReadyJobs(5);if(0===a.length)return 0;for(let b of((0,e.fH)(`Processing ${a.length} notification jobs`),a))try{await this.markJobProcessing(b.id),await this.processJob(b),await this.markJobCompleted(b.id)}catch(c){let a=c instanceof Error?c.message:"Unknown error";await this.markJobFailed(b.id,a)}return a.length}finally{this.isProcessing=!1}}}getStatus(){return{running:null!==this.processingInterval,lastProcessedAt:this.lastProcessedAt?this.lastProcessedAt.toISOString():null}}async processJob(a){let b={title:a.title,body:a.body,icon:a.icon,badge:a.badge,image:a.image,data:a.data,actions:a.actions,tag:a.tag,requireInteraction:a.requireInteraction,silent:a.silent,vibrate:a.vibrate,userIds:a.userIds,allUsers:a.allUsers},c=await fetch("http://localhost:3000/api/notifications/send",{method:"POST",headers:{"Content-Type":"application/json","X-System-Job":"true","X-Job-Id":a.id},body:JSON.stringify(b)});if(!c.ok){let a=await c.text();throw Error(`Failed to send notification: ${a}`)}(0,e.fH)(`Successfully processed notification job ${a.id}`)}constructor(){this.processingInterval=null,this.isProcessing=!1,this.idleCyclesWithoutWork=0,this.IDLE_STOP_CYCLES=40,this.lastProcessedAt=null}}let i=h.getInstance();d()}catch(a){d(a)}})},30477:(a,b,c)=>{"use strict";c.d(b,{HG:()=>i,JE:()=>g,fH:()=>h,vF:()=>e,vV:()=>f});class d{constructor(){this.isDevelopment=!1,this.logLevel=this.isDevelopment?3:2}shouldLog(a){return a<=this.logLevel}formatLogEntry(a){let b=["ERROR","WARN","INFO","DEBUG"][a.level],c=`[${a.timestamp}] ${b}: ${a.message}`;return a.context&&Object.keys(a.context).length>0&&(c+=` | Context: ${JSON.stringify(a.context)}`),a.error&&(c+=` | Error: ${a.error.message}`,this.isDevelopment&&a.error.stack&&(c+=` | Stack: ${a.error.stack}`)),c}log(a,b,c,d){if(!this.shouldLog(a))return;let e={level:a,message:b,timestamp:new Date().toISOString(),context:c,error:d},f=this.formatLogEntry(e);0===a&&console.error(f),!this.isDevelopment&&a<=1&&this.sendToExternalService(e)}async sendToExternalService(a){}error(a,b,c){this.log(0,a,b,c)}warn(a,b){this.log(1,a,b)}info(a,b){this.log(2,a,b)}debug(a,b){this.log(3,a,b)}apiLog(a,b,c,d,e){let f=`${a} ${b} - ${c}${d?` (${d}ms)`:""}`,g=c>=500?0:c>=400?1:2;this.log(g,f,{method:a,path:b,statusCode:c,duration:d,...e})}dbLog(a,b,c,d){let e=`DB ${a} on ${b}${c?` (${c}ms)`:""}`;this.log(3,e,{operation:a,table:b,duration:c,...d})}authLog(a,b,c=!0,d){let e=`Auth ${a}${b?` for user ${b}`:""} - ${c?"SUCCESS":"FAILED"}`;this.log(c?2:1,e,{action:a,userId:b,success:c,...d})}}let e=new d,f=(a,b,c)=>{b instanceof Error?e.error(a,void 0,b):"object"==typeof b&&null!==b?e.error(a,b,c):e.error(a,void 0,c)},g=(a,b)=>e.warn(a,b),h=(a,b)=>e.info(a,b),i=(a,b,c,d,f)=>e.apiLog(a,b,c,d,f)},67939:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{KU:()=>j,P:()=>k,UU:()=>i});var e=c(30477),f=c(64939),g=a([f]);f=(g.then?(await g)():g)[0];let h=null,i=()=>{if(!h){let a="postgresql://neondb_owner:npg_MRLUf85DBNPv@ep-curly-meadow-aefoagku-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";if(!a)throw Error("Missing Neon database environment variables. Please set DATABASE_URL");(h=new f.Pool({connectionString:a,ssl:{rejectUnauthorized:!1},max:20,idleTimeoutMillis:3e4,connectionTimeoutMillis:2e3})).on("error",a=>{(0,e.vV)("Unexpected error on idle client",a)})}return h},j=async()=>{let a=i();return await a.connect()},k=async(a,b)=>{let c=await j();try{return await c.query(a,b)}finally{c.release()}};d()}catch(a){d(a)}})},74291:(a,b,c)=>{"use strict";c.d(b,{_:()=>m,authenticateRequest:()=>l});var d=c(30477);c(10641);var e=c(86802),f=c(80829),g=c.n(f),h=c(94570),i=c(41393),j=c(48689);async function k(){try{let a=await (0,e.b3)(),b=a.get("authorization"),c=null;if(b&&b.startsWith("Bearer "))c=b.substring(7);else{let b=a.get("cookie");b&&(c=b.split(";").reduce((a,b)=>{let[c,d]=b.trim().split("=");return a[c]=d,a},{}).auth_token||null)}if(!c)return null;let d=g().verify(c,"local-development-jwt-secret-key");if(!d||!d.userId)return null;let f=(0,h.Lf)(),k=await f.select({id:i.users.id,email:i.users.email,full_name:i.users.full_name,username:i.users.username,date_of_birth:i.users.date_of_birth,created_at:i.users.created_at,updated_at:i.users.updated_at,subscription_tier:i.users.subscription_tier,subscription_status:i.users.subscription_status}).from(i.users).where((0,j.eq)(i.users.id,d.userId)).limit(1);if(0===k.length)return null;let l=k[0];return{id:l.id,email:l.email,full_name:l.full_name,name:l.full_name,username:l.username,created_at:l.created_at,updated_at:l.updated_at,subscription_tier:l.subscription_tier??"free",subscription_status:l.subscription_status??"active"}}catch(a){return(0,d.vV)("JWT authentication error:",a),null}}async function l(){try{let a=await k();if(a)return{user:a,error:null};return{user:null,error:"No authenticated user session found"}}catch(a){return(0,d.vV)("Authentication error:",a),{user:null,error:"Authentication failed"}}}async function m(a){try{let a=await l();return{user:a.user||void 0,error:a.error||void 0}}catch(a){return(0,d.vV)("verifyAuth error:",a),{error:"Authentication failed"}}}},78335:()=>{},96487:()=>{}};