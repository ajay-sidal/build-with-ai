"""
title: Server File Manager (Trinity v2.0)
author: Ajay Trinity
version: 2.0
description: Safe read/write access with guardrails
"""
import os, shutil, subprocess
from pathlib import Path
from datetime import datetime
from pydantic import BaseModel, field_validator

class Config(BaseModel):
    project_root: str = "/root/build-with-ai"
    allowed_ext: list = ['.tsx','.ts','.js','.jsx','.json','.md','.css']
    blocked_paths: list = ['.env','secrets','node_modules/.git','keys/']
    max_lines: int = 100
    @field_validator('project_root')
    def validate(cls, v): return v if '/build-with-ai' in v else ValueError("Invalid path")

class Tools:
    def __init__(self): self.config = Config()
    def _check(self, path):
        p = Path(f"{self.config.project_root}/{path}" if not path.startswith('/') else path)
        try: p.relative_to(Path(self.config.project_root))
        except: return False,"⚠️ TRINITY VIOLATION: Outside project root"
        ext = p.suffix.lower()
        if ext not in self.config.allowed_ext: return False,f"⚠️ TRINITY: {ext} blocked"
        for b in self.config.blocked_paths:
            if b in str(p): return False,f"⚠️ TRINITY: {b} blocked"
        return True,""

    def read_file(self, path:str)->str:
        ok,msg=self._check(path)
        if not ok: return msg
        try:
            with open(str(Path(path).resolve()),'r',encoding='utf-8') as f: return f.read()
        except Exception as e: return f"❌ Error: {str(e)}"
    
    def write_file(self, path:str,content:str)->str:
        ok,msg=self._check(path)
        if not ok: return msg
        lines=len(content.splitlines())
        if lines>self.config.max_lines: 
            return f"⚠️ TRINITY FLAG: {lines} lines need approval (max:{self.config.max_lines})"
        try:
            Path(path).parent.mkdir(parents=True,exist_ok=True)
            with open(str(Path(path).resolve()),'w',encoding='utf-8') as f: f.write(content)
            return f"✅ Written: {len(content)} chars, {lines} lines (DO IT RIGHT→FIRST TIME→EVERY TIME)"
        except Exception as e: return f"❌ Error: {str(e)}"
