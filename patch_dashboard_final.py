import os, re
path = r'd:\AI Agent Project\some-game\Startup-tycoon-game-\components\GameDashboard.tsx'
content = open(path, 'r', encoding='utf-8').read()
pattern = re.compile(r'\{/\*\s*Strategy\s*Section\s*\*/\}.*?\{/\*\s*Funding\s*\*/\}', re.DOTALL)
new_block = '''{/* Strategy Section */}
                  <div className=\"space-y-6\">
                      <div className=\"flex items-center justify-between border-b border-slate-100 pb-2\">
                        <h4 className=\"text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]\">Directives</h4>
                        <div className=\"h-1 w-12 bg-blue-100 rounded-full\"></div>
                      </div>
                      
                      <DirectiveSelector 
                        label=\"R&D Priority\"
                        icon={<Settings2 size={12}/>}
                        value={rdFocus}
                        onChange={setRdFocus}
                        options={[
                            \'Nâng cấp tính năng cốt lõi\',
                            \'Sửa lỗi & Ổn định hệ thống\',
                            \'Nghiên cứu công nghệ mới (AI)\',
                            \'Không làm gì / Tạm dừng\'
                        ]}
                      />

                      <DirectiveSelector 
                        label=\"Marketing Focus\"
                        icon={<Megaphone size={12}/>}
                        value={marketingFocus}
                        onChange={setMarketingFocus}
                        options={[
                            \'Chạy quảng cáo Facebook/Google\',
                            \'Content Marketing (SEO)\',
                            \'Thuê Influencer/KOL\',
                            \'Không làm gì / Tạm dừng\'
                        ]}
                      />

                      <div className=\"space-y-3 group\">
                          <label className=\"text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 px-1\">
                             <span className=\"p-1 bg-slate-100 rounded text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors\">
                                <FileText size={12}/>
                             </span>
                             CEO Note
                          </label>
                          <textarea 
                            value={strategyNote} 
                            onChange={e => setStrategyNote(e.target.value)} 
                            className=\"w-full h-24 text-xs p-3 bg-white border border-slate-200 rounded-xl resize-none outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all font-medium shadow-sm\" 
                            placeholder=\"E.g. Focus on quality over speed...\"
                          />
                      </div>
                  </div>

                  {/* Funding '''

if pattern.search(content):
    content = pattern.sub(new_block + '*/}', content)
    open(path, 'w', encoding='utf-8').write(content)
    print('SUCCESS')
else:
    print('PATTERN_NOT_FOUND')
