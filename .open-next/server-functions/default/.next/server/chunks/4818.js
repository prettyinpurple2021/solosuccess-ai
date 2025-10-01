exports.id=4818,exports.ids=[4818],exports.modules={30477:(a,b,c)=>{"use strict";c.d(b,{HG:()=>i,JE:()=>g,fH:()=>h,vF:()=>e,vV:()=>f});class d{constructor(){this.isDevelopment=!1,this.logLevel=this.isDevelopment?3:2}shouldLog(a){return a<=this.logLevel}formatLogEntry(a){let b=["ERROR","WARN","INFO","DEBUG"][a.level],c=`[${a.timestamp}] ${b}: ${a.message}`;return a.context&&Object.keys(a.context).length>0&&(c+=` | Context: ${JSON.stringify(a.context)}`),a.error&&(c+=` | Error: ${a.error.message}`,this.isDevelopment&&a.error.stack&&(c+=` | Stack: ${a.error.stack}`)),c}log(a,b,c,d){if(!this.shouldLog(a))return;let e={level:a,message:b,timestamp:new Date().toISOString(),context:c,error:d},f=this.formatLogEntry(e);0===a&&console.error(f),!this.isDevelopment&&a<=1&&this.sendToExternalService(e)}async sendToExternalService(a){}error(a,b,c){this.log(0,a,b,c)}warn(a,b){this.log(1,a,b)}info(a,b){this.log(2,a,b)}debug(a,b){this.log(3,a,b)}apiLog(a,b,c,d,e){let f=`${a} ${b} - ${c}${d?` (${d}ms)`:""}`,g=c>=500?0:c>=400?1:2;this.log(g,f,{method:a,path:b,statusCode:c,duration:d,...e})}dbLog(a,b,c,d){let e=`DB ${a} on ${b}${c?` (${c}ms)`:""}`;this.log(3,e,{operation:a,table:b,duration:c,...d})}authLog(a,b,c=!0,d){let e=`Auth ${a}${b?` for user ${b}`:""} - ${c?"SUCCESS":"FAILED"}`;this.log(c?2:1,e,{action:a,userId:b,success:c,...d})}}let e=new d,f=(a,b,c)=>{b instanceof Error?e.error(a,void 0,b):"object"==typeof b&&null!==b?e.error(a,b,c):e.error(a,void 0,c)},g=(a,b)=>e.warn(a,b),h=(a,b)=>e.info(a,b),i=(a,b,c,d,f)=>e.apiLog(a,b,c,d,f)},67939:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{KU:()=>j,P:()=>k,UU:()=>i});var e=c(30477),f=c(64939),g=a([f]);f=(g.then?(await g)():g)[0];let h=null,i=()=>{if(!h){let a="postgresql://neondb_owner:npg_MRLUf85DBNPv@ep-curly-meadow-aefoagku-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";if(!a)throw Error("Missing Neon database environment variables. Please set DATABASE_URL");(h=new f.Pool({connectionString:a,ssl:{rejectUnauthorized:!1},max:20,idleTimeoutMillis:3e4,connectionTimeoutMillis:2e3})).on("error",a=>{(0,e.vV)("Unexpected error on idle client",a)})}return h},j=async()=>{let a=i();return await a.connect()},k=async(a,b)=>{let c=await j();try{return await c.query(a,b)}finally{c.release()}};d()}catch(a){d(a)}})},73927:(a,b,c)=>{"use strict";function d(){let a="postgresql://neondb_owner:npg_MRLUf85DBNPv@ep-curly-meadow-aefoagku-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";if(!a)throw Error("DATABASE_URL is not set");return neon(a)}c.d(b,{QM:()=>g,Ww:()=>h});class e{async ensureTablesExist(){let a=d();await a`
      CREATE TABLE IF NOT EXISTS file_storage (
        id SERIAL PRIMARY KEY,
        pathname VARCHAR(255) UNIQUE NOT NULL,
        filename VARCHAR(255) NOT NULL,
        content_type VARCHAR(100) NOT NULL,
        file_size INTEGER NOT NULL,
        file_data BYTEA NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `,await a`
      CREATE INDEX IF NOT EXISTS idx_file_storage_pathname 
      ON file_storage(pathname)
    `}async upload(a,b){try{await this.ensureTablesExist();let c=d(),e=await a.arrayBuffer(),f=Buffer.from(e);await c`
        INSERT INTO file_storage (pathname, filename, content_type, file_size, file_data)
        VALUES (${b}, ${a.name}, ${a.type}, ${a.size}, ${f})
        ON CONFLICT (pathname) DO UPDATE SET
          filename = EXCLUDED.filename,
          content_type = EXCLUDED.content_type,
          file_size = EXCLUDED.file_size,
          file_data = EXCLUDED.file_data,
          updated_at = NOW()
      `;let g=`/api/files/${encodeURIComponent(b)}`;return logInfo(`File uploaded to Neon database: ${b}`),{url:g,pathname:b,contentType:a.type,contentDisposition:`attachment; filename="${a.name}"`}}catch(a){throw logError("Error uploading file to Neon:",{error:a}),a}}async delete(a){try{await this.ensureTablesExist();let b=d();await b`
        DELETE FROM file_storage WHERE pathname = ${a}
      `,logInfo(`File deleted from Neon database: ${a}`)}catch(a){throw logError("Error deleting file from Neon:",{error:a}),a}}async list(a){try{await this.ensureTablesExist();let b=d();return(await b`
        SELECT pathname, file_size, created_at
        FROM file_storage
        WHERE pathname LIKE ${a+"%"}
        ORDER BY created_at DESC
      `).map(a=>({url:`/api/files/${encodeURIComponent(a.pathname)}`,pathname:a.pathname,size:a.file_size,uploadedAt:a.created_at}))}catch(a){throw logError("Error listing files from Neon:",{error:a}),a}}}let f=new e,g=async(a,b,c)=>{try{let d=`users/${c}/${Date.now()}-${b}`,e=await f.upload(a,d);return{url:e.url,pathname:e.pathname,contentType:a.type,contentDisposition:`attachment; filename="${b}"`}}catch(a){throw logError("Error uploading file:",a),Error("Failed to upload file")}},h=async a=>{try{await f.delete(a)}catch(a){throw logError("Error deleting file:",a),Error("Failed to delete file")}}},78335:()=>{},82078:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{l:()=>j});var e=c(30477),f=c(67939),g=c(73927),h=a([f]);f=(h.then?(await h)():h)[0];class i{static getInstance(){return i.instance||(i.instance=new i),i.instance}async initialize(){await (0,f.P)(`
      CREATE TABLE IF NOT EXISTS user_briefcases (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `),await (0,f.P)(`
      CREATE TABLE IF NOT EXISTS briefcase_items (
        id VARCHAR(255) PRIMARY KEY,
        briefcase_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('avatar', 'chat', 'brand', 'template_save', 'document', 'ai_interaction')),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content JSONB,
        blob_url TEXT,
        file_size BIGINT,
        mime_type VARCHAR(255),
        tags TEXT[] DEFAULT '{}',
        metadata JSONB DEFAULT '{}',
        is_private BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `),await (0,f.P)("CREATE INDEX IF NOT EXISTS idx_user_briefcases_user_id ON user_briefcases(user_id)"),await (0,f.P)("CREATE INDEX IF NOT EXISTS idx_user_briefcases_default ON user_briefcases(user_id, is_default)"),await (0,f.P)("CREATE INDEX IF NOT EXISTS idx_briefcase_items_briefcase_id ON briefcase_items(briefcase_id)"),await (0,f.P)("CREATE INDEX IF NOT EXISTS idx_briefcase_items_user_id ON briefcase_items(user_id)"),await (0,f.P)("CREATE INDEX IF NOT EXISTS idx_briefcase_items_type ON briefcase_items(type)"),await (0,f.P)("CREATE INDEX IF NOT EXISTS idx_briefcase_items_tags ON briefcase_items USING GIN(tags)"),(0,e.fH)("Unified briefcase system initialized")}async getDefaultBriefcase(a){let b=await (0,f.P)(`
      SELECT * FROM user_briefcases 
      WHERE user_id = $1 AND is_default = true
      LIMIT 1
    `,[a]);if(b.rows.length>0){let a=b.rows[0];return{id:a.id,userId:a.user_id,name:a.name,description:a.description,isDefault:a.is_default,createdAt:new Date(a.created_at),updatedAt:new Date(a.updated_at)}}let c=`briefcase_${a}_${Date.now()}`;return await (0,f.P)(`
      INSERT INTO user_briefcases (id, user_id, name, description, is_default)
      VALUES ($1, $2, $3, $4, true)
    `,[c,a,"My Briefcase","Your personal workspace for all content"]),{id:c,userId:a,name:"My Briefcase",description:"Your personal workspace for all content",isDefault:!0,createdAt:new Date,updatedAt:new Date}}async uploadAvatar(a,b){if(!b.type.startsWith("image/"))throw Error("Avatar must be an image file");if(b.size>5242880)throw Error("Avatar file size must be under 5MB");let c=await this.getDefaultBriefcase(a);await this.deleteItemsByType(a,"avatar");let d=`avatar_${Date.now()}.${b.type.split("/")[1]}`,e=await (0,g.QM)(b,d,a),h=`avatar_${a}_${Date.now()}`;return await (0,f.P)(`
      INSERT INTO briefcase_items (
        id, briefcase_id, user_id, type, title, description,
        blob_url, file_size, mime_type, metadata, is_private
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false)
    `,[h,c.id,a,"avatar","Profile Avatar","User profile picture",e.url,b.size,b.type,JSON.stringify({originalName:b.name,uploadedAt:new Date})]),{id:h,briefcaseId:c.id,userId:a,type:"avatar",title:"Profile Avatar",description:"User profile picture",blobUrl:e.url,fileSize:b.size,mimeType:b.type,tags:[],metadata:{originalName:b.name,uploadedAt:new Date},isPrivate:!1,createdAt:new Date,updatedAt:new Date}}async saveChatConversation(a,b,c,d){let e=await this.getDefaultBriefcase(a),g=`chat_${a}_${Date.now()}`;return await (0,f.P)(`
      INSERT INTO briefcase_items (
        id, briefcase_id, user_id, type, title, content, metadata, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,[g,e.id,a,"chat",b,JSON.stringify({messages:c}),JSON.stringify({agentName:d,messageCount:c.length,lastMessage:new Date}),d?[d,"conversation"]:["conversation"]]),{id:g,briefcaseId:e.id,userId:a,type:"chat",title:b,content:{messages:c},tags:d?[d,"conversation"]:["conversation"],metadata:{agentName:d,messageCount:c.length,lastMessage:new Date},isPrivate:!0,createdAt:new Date,updatedAt:new Date}}async saveBrandWork(a,b,c){let d=await this.getDefaultBriefcase(a),e=`brand_${a}_${Date.now()}`;return await (0,f.P)(`
      INSERT INTO briefcase_items (
        id, briefcase_id, user_id, type, title, content, metadata, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,[e,d.id,a,"brand",b,JSON.stringify(c),JSON.stringify({brandType:c.type||"general",lastModified:new Date}),["branding","design"]]),{id:e,briefcaseId:d.id,userId:a,type:"brand",title:b,content:c,tags:["branding","design"],metadata:{brandType:c.type||"general",lastModified:new Date},isPrivate:!0,createdAt:new Date,updatedAt:new Date}}async saveTemplateProgress(a,b,c,d,e){let g=await this.getDefaultBriefcase(a),h=await (0,f.P)(`
      SELECT id FROM briefcase_items 
      WHERE user_id = $1 AND type = 'template_save' 
      AND metadata->>'templateSlug' = $2
    `,[a,b]);if(h.rows.length>0){let i=h.rows[0].id;return await (0,f.P)(`
        UPDATE briefcase_items 
        SET title = $1, content = $2, 
            metadata = $3, updated_at = NOW()
        WHERE id = $4
      `,[c,JSON.stringify(d),JSON.stringify({templateSlug:b,progress:e,lastSaved:new Date}),i]),{id:i,briefcaseId:g.id,userId:a,type:"template_save",title:c,content:d,tags:["template",b],metadata:{templateSlug:b,progress:e,lastSaved:new Date},isPrivate:!0,createdAt:new Date,updatedAt:new Date}}let i=`template_${a}_${b}_${Date.now()}`;return await (0,f.P)(`
      INSERT INTO briefcase_items (
        id, briefcase_id, user_id, type, title, content, metadata, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,[i,g.id,a,"template_save",c,JSON.stringify(d),JSON.stringify({templateSlug:b,progress:e,lastSaved:new Date}),["template",b]]),{id:i,briefcaseId:g.id,userId:a,type:"template_save",title:c,content:d,tags:["template",b],metadata:{templateSlug:b,progress:e,lastSaved:new Date},isPrivate:!0,createdAt:new Date,updatedAt:new Date}}async getBriefcaseItems(a,b,c=50,d=0,e){let g="user_id = $1",h=[a],i=2;if(b&&(g+=` AND type = $${i}`,h.push(b),i++),e){g+=` AND (
        title ILIKE $${i} OR 
        description ILIKE $${i+1} OR 
        $${i+2} = ANY(tags)
      )`;let a=`%${e}%`;h.push(a,a,e),i+=3}let j=await (0,f.P)(`
      SELECT COUNT(*) as total FROM briefcase_items WHERE ${g}
    `,h);return{items:(await (0,f.P)(`
      SELECT * FROM briefcase_items 
      WHERE ${g}
      ORDER BY updated_at DESC
      LIMIT $${i} OFFSET $${i+1}
    `,[...h,c,d])).rows.map(a=>({id:a.id,briefcaseId:a.briefcase_id,userId:a.user_id,type:a.type,title:a.title,description:a.description,content:a.content?JSON.parse(a.content):void 0,blobUrl:a.blob_url,fileSize:a.file_size,mimeType:a.mime_type,tags:a.tags||[],metadata:a.metadata?JSON.parse(a.metadata):{},isPrivate:a.is_private,createdAt:new Date(a.created_at),updatedAt:new Date(a.updated_at)})),total:parseInt(j.rows[0].total)}}async getUserAvatar(a){let b=await (0,f.P)(`
      SELECT * FROM briefcase_items 
      WHERE user_id = $1 AND type = 'avatar'
      ORDER BY created_at DESC
      LIMIT 1
    `,[a]);if(0===b.rows.length)return null;let c=b.rows[0];return{id:c.id,briefcaseId:c.briefcase_id,userId:c.user_id,type:c.type,title:c.title,description:c.description,blobUrl:c.blob_url,fileSize:c.file_size,mimeType:c.mime_type,tags:c.tags||[],metadata:c.metadata?JSON.parse(c.metadata):{},isPrivate:c.is_private,createdAt:new Date(c.created_at),updatedAt:new Date(c.updated_at)}}async deleteItemsByType(a,b){for(let c of(await (0,f.P)(`
      SELECT blob_url FROM briefcase_items 
      WHERE user_id = $1 AND type = $2 AND blob_url IS NOT NULL
    `,[a,b])).rows)if(c.blob_url)try{await (0,g.Ww)(c.blob_url)}catch(a){(0,e.JE)("Failed to delete blob:",a)}await (0,f.P)(`
      DELETE FROM briefcase_items 
      WHERE user_id = $1 AND type = $2
    `,[a,b])}async deleteItem(a,b){let c=await (0,f.P)(`
      SELECT blob_url FROM briefcase_items 
      WHERE id = $1 AND user_id = $2
    `,[b,a]);if(0===c.rows.length)return!1;if(c.rows[0].blob_url)try{await (0,g.Ww)(c.rows[0].blob_url)}catch(a){(0,e.JE)("Failed to delete blob:",a)}return await (0,f.P)(`
      DELETE FROM briefcase_items 
      WHERE id = $1 AND user_id = $2
    `,[b,a]),!0}}let j=i.getInstance();d()}catch(a){d(a)}})},96487:()=>{}};