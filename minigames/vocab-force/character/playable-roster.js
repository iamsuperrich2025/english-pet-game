"use strict";
/* Playable character definitions. Preview images only here; GLBs load after START. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  const KEY = 'vocabForce.character';

  const NEX = {
    id: 'nex',
    displayName: 'NEX',
    subtitle: 'Tactical Power',
    gun: 'iron_jackal',
    preview: 'ui/portraits/nex.webp',
    loading: 'ui/loading/nex.avif',
    idleClip: 'Walking.001',
    core: ['run', 'punch', 'kick', 'block', 'jump', 'vault'],
    optional: ['victory', 'heavyKick', 'land'],
    getManifest: function(){ return VF.NexManifest; }
  };

  const LYRA = {
    id: 'lyravyn',
    displayName: 'Lyravyn',
    subtitle: 'Agile Striker',
    gun: 'aurora_fang',
    preview: 'ui/portraits/lyravyn.webp',
    loading: 'ui/loading/lyravyn.avif',
    idleClip: 'Running.001',
    core: ['run', 'punch', 'kick', 'jump', 'vault'],
    optional: ['victory', 'land'],
    getManifest: function(){ return VF.LyraManifest; }
  };

  const ALL = [NEX, LYRA];

  VF.PlayableRoster = {
    KEY: KEY,
    all: function(){ return ALL.slice(); },
    get: function(id){
      const want = String(id || '').toLowerCase();
      for(let i = 0; i < ALL.length; i++){
        if(ALL[i].id === want) return ALL[i];
      }
      return null;
    },
    readSaved: function(){
      try{
        if(!root.localStorage) return null;
        const id = root.localStorage.getItem(KEY);
        return this.get(id) ? id : null;
      }catch(_){ return null; }
    },
    save: function(id){
      const def = this.get(id);
      if(!def) return false;
      try{
        if(root.localStorage) root.localStorage.setItem(KEY, def.id);
      }catch(_){}
      return true;
    },
    previewUrl: function(def){
      return VF.asset((def && def.preview) || NEX.preview);
    },
    loadingUrl: function(def){
      return VF.asset((def && def.loading) || NEX.loading);
    }
  };
  VF._t.playableRoster = VF.PlayableRoster;
})(typeof window !== 'undefined' ? window : globalThis);
