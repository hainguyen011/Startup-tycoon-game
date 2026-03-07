$file = "d:\AI Agent Project\some-game\Startup-tycoon-game-\components\GameDashboard.tsx"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Old: TechDebt row inside the 3-column grid, then closing div, then empty line, then Modules section
$oldSnippet = @'
                                              <div className="flex justify-between items-center bg-rose-50 px-4 py-3 rounded-xl border border-rose-100">
                                                  <div className="text-xs font-bold text-rose-500 uppercase flex items-center gap-1"><ShieldAlert size={14}/> {t('dashboard.products.techDebt')}</div>
                                                  <div className={`font-bold text-lg ${p.techDebt > 60 ? 'text-rose-600' : 'text-slate-800'}`}>{p.techDebt}%</div>
                                              </div>
                                          </div>

                                          <div className="mt-8 pt-6 border-t border-slate-100">
'@

$newSnippet = @'
                                          </div>

                                          {/* Product Team Assignment */}
                                          <div className="pl-4 mt-6 flex flex-col md:flex-row items-start gap-6">
                                              <div className="flex-1 w-full">
                                                  <div className="flex items-center justify-between mb-2">
                                                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                          <Users size={14} className="text-blue-500"/> Product Team
                                                      </h4>
                                                      <select
                                                          className="text-xs bg-blue-50 border border-blue-100 rounded-lg p-1.5 font-bold text-blue-700 outline-none"
                                                          onChange={(e) => { if(e.target.value) onAssignEmployee(e.target.value, p.id); }}
                                                          value=""
                                                      >
                                                          <option value="">+ Assign Staff</option>
                                                          {state.employees.filter(e => !e.assignedContractId && e.assignedProductId !== p.id).map(e => (
                                                              <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                                                          ))}
                                                      </select>
                                                  </div>
                                                  <div className="flex flex-wrap gap-2 min-h-[28px]">
                                                      {state.employees.filter(e => e.assignedProductId === p.id).map(e => (
                                                          <span key={e.id} className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full flex items-center gap-1 group">
                                                              {e.name} ({e.role})
                                                              <button onClick={() => onAssignEmployee(e.id, null)} className="hover:text-red-500 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                                                          </span>
                                                      ))}
                                                      {state.employees.filter(e => e.assignedProductId === p.id).length === 0 && (
                                                          <span className="text-[10px] text-slate-400 italic">No staff assigned</span>
                                                      )}
                                                  </div>
                                              </div>
                                              <div className="flex justify-between items-center bg-rose-50 px-4 py-3 rounded-xl border border-rose-100 shrink-0">
                                                  <div className="text-xs font-bold text-rose-500 uppercase flex items-center gap-1 mr-3"><ShieldAlert size={14}/> {t('dashboard.products.techDebt')}</div>
                                                  <div className={`font-bold text-lg ${p.techDebt > 60 ? 'text-rose-600' : 'text-slate-800'}`}>{p.techDebt}%</div>
                                              </div>
                                          </div>

                                          <div className="mt-8 pt-6 border-t border-slate-100">
'@

if ($content.Contains($oldSnippet)) {
    Write-Host "Match found! Performing replacement..."
    $newContent = $content.Replace($oldSnippet, $newSnippet)
    [System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "Done."
} else {
    Write-Host "No match. Trying CRLF version..."
    $oldSnippetCRLF = $oldSnippet.Replace("`n", "`r`n")
    if ($content.Contains($oldSnippetCRLF)) {
        Write-Host "CRLF match found! Replacing..."
        $newContent = $content.Replace($oldSnippetCRLF, $newSnippet)
        [System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Done."
    } else {
        Write-Host "Still no match. Dumping surrounding context for debugging..."
        $idx = $content.IndexOf("bg-rose-50 px-4 py-3 rounded-xl border border-rose-100")
        Write-Host "IdxOfRose = $idx"
        if ($idx -ge 0) {
            Write-Host $content.Substring($idx - 100, 400)
        }
    }
}
