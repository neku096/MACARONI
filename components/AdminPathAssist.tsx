"use client";

import { type ChangeEvent, type DragEvent, useId, useRef, useState } from "react";

type PathCandidate = {
  note: string;
  value: string;
  warning?: string;
};

type AdminPathFieldProps = {
  basePath: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
  accept?: string;
  helpText?: string;
  wide?: boolean;
};

type AdminGalleryPrefixFieldProps = {
  label: string;
  onChange: (value: string) => void;
  value: string;
  helpText?: string;
};

type AdminGalleryNumbersFieldProps = {
  label: string;
  onApply: (numbers: number[]) => void;
  onTextChange: (value: string) => void;
  value: string;
  helpText?: string;
};

type AdminGalleryTextFieldProps = {
  basePath: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
  helpText?: string;
  rows?: number;
};

export function AdminPathField({
  accept = "image/*",
  basePath,
  helpText,
  label,
  onChange,
  value,
  wide = false,
}: AdminPathFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [candidates, setCandidates] = useState<PathCandidate[]>([]);

  function handleFiles(files: FileList | File[]) {
    setCandidates(createPathCandidates(Array.from(files).map(getFileInputName), basePath));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const text = event.dataTransfer.getData("text/plain");
    const values = event.dataTransfer.files.length
      ? Array.from(event.dataTransfer.files).map(getFileInputName)
      : splitDroppedText(text);
    setCandidates(createPathCandidates(values, basePath));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      handleFiles(event.target.files);
    }
    event.target.value = "";
  }

  return (
    <div className={`admin-field admin-path-field${wide ? " admin-field-wide" : ""}`}>
      <label htmlFor={inputId}>
        <span>{label}</span>
      </label>
      <input id={inputId} value={value} onChange={(event) => onChange(event.target.value)} />
      <div className="admin-path-tools">
        <button className="button compact" type="button" onClick={() => fileInputRef.current?.click()}>
          参照
        </button>
        <div className="admin-drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
          画像をD&D
        </div>
        <input
          ref={fileInputRef}
          className="admin-hidden-file"
          type="file"
          accept={accept}
          onChange={handleFileChange}
        />
      </div>
      {helpText ? <p className="admin-help">{helpText}</p> : null}
      <PathCandidateList candidates={candidates} onApply={(candidate) => onChange(candidate.value)} />
    </div>
  );
}

export function AdminGalleryPrefixField({ helpText, label, onChange, value }: AdminGalleryPrefixFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [candidate, setCandidate] = useState("");

  function handleFiles(files: FileList | File[]) {
    const fileName = getFileInputName(Array.from(files)[0]);
    setCandidate(extractGalleryPrefix(fileName));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const text = event.dataTransfer.getData("text/plain");
    const valueFromDrop = event.dataTransfer.files[0]
      ? getFileInputName(event.dataTransfer.files[0])
      : splitDroppedText(text)[0] ?? "";
    setCandidate(extractGalleryPrefix(valueFromDrop));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      handleFiles(event.target.files);
    }
    event.target.value = "";
  }

  return (
    <div className="admin-field admin-path-field">
      <label htmlFor={inputId}>
        <span>{label}</span>
      </label>
      <input id={inputId} value={value} onChange={(event) => onChange(event.target.value)} />
      <div className="admin-path-tools">
        <button className="button compact" type="button" onClick={() => fileInputRef.current?.click()}>
          参照
        </button>
        <div className="admin-drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
          先頭画像をD&D
        </div>
        <input
          ref={fileInputRef}
          className="admin-hidden-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      {helpText ? <p className="admin-help">{helpText}</p> : null}
      {candidate ? (
        <div className="admin-path-candidates">
          <div className="admin-path-candidate">
            <code>{candidate}</code>
            <button className="button compact" type="button" onClick={() => onChange(candidate)}>
              共通名へ反映
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AdminGalleryNumbersField({
  helpText,
  label,
  onApply,
  onTextChange,
  value,
}: AdminGalleryNumbersFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [candidateNumbers, setCandidateNumbers] = useState<number[]>([]);
  const [warning, setWarning] = useState("");

  function updateCandidate(values: string[]) {
    const numbers = extractGalleryNumbers(values);
    setCandidateNumbers(numbers);
    setWarning(numbers.length ? "" : "画像名から番号を抽出できませんでした。必要なら手入力してください。");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      updateCandidate(Array.from(event.target.files).map(getFileInputName));
    }
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const text = event.dataTransfer.getData("text/plain");
    const values = event.dataTransfer.files.length
      ? Array.from(event.dataTransfer.files).map(getFileInputName)
      : splitDroppedText(text);
    updateCandidate(values);
  }

  return (
    <div className="admin-field admin-field-wide admin-path-field">
      <label htmlFor={inputId}>
        <span>{label}</span>
      </label>
      <input
        id={inputId}
        placeholder="例: 1, 2, 5。空欄なら枚数分を自動生成"
        value={value}
        onChange={(event) => onTextChange(event.target.value)}
      />
      <div className="admin-path-tools">
        <button className="button compact" type="button" onClick={() => fileInputRef.current?.click()}>
          複数参照
        </button>
        <div className="admin-drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
          複数画像をD&D
        </div>
        <input
          ref={fileInputRef}
          className="admin-hidden-file"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </div>
      {helpText ? <p className="admin-help">{helpText}</p> : null}
      {warning ? <p className="admin-inline-warning">{warning}</p> : null}
      {candidateNumbers.length ? (
        <div className="admin-path-candidates">
          <div className="admin-path-candidate">
            <code>{candidateNumbers.join(",")}</code>
            <button className="button compact" type="button" onClick={() => onApply(candidateNumbers)}>
              番号候補を反映
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AdminGalleryTextField({
  basePath,
  helpText,
  label,
  onChange,
  rows = 4,
  value,
}: AdminGalleryTextFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [candidateLines, setCandidateLines] = useState<string[]>([]);

  function handleFiles(files: FileList | File[]) {
    const candidates = createPathCandidates(Array.from(files).map(getFileInputName), basePath);
    setCandidateLines(candidates.map((candidate) => `${candidate.value} | ${createAltFromPath(candidate.value)}`));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      handleFiles(event.target.files);
    }
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const text = event.dataTransfer.getData("text/plain");
    const values = event.dataTransfer.files.length
      ? Array.from(event.dataTransfer.files).map(getFileInputName)
      : splitDroppedText(text);
    const candidates = createPathCandidates(values, basePath);
    setCandidateLines(candidates.map((candidate) => `${candidate.value} | ${createAltFromPath(candidate.value)}`));
  }

  function appendCandidateLines() {
    const nextValue = [value.trim(), candidateLines.join("\n")].filter(Boolean).join("\n");
    onChange(nextValue);
  }

  return (
    <div className="admin-field admin-field-wide admin-path-field">
      <label htmlFor={inputId}>
        <span>{label}</span>
      </label>
      <textarea id={inputId} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      <div className="admin-path-tools">
        <button className="button compact" type="button" onClick={() => fileInputRef.current?.click()}>
          複数参照
        </button>
        <div className="admin-drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
          ギャラリー画像をD&D
        </div>
        <input
          ref={fileInputRef}
          className="admin-hidden-file"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </div>
      {helpText ? <p className="admin-help">{helpText}</p> : null}
      {candidateLines.length ? (
        <div className="admin-path-candidates">
          <pre>{candidateLines.join("\n")}</pre>
          <button className="button compact" type="button" onClick={appendCandidateLines}>
            ギャラリーへ追加
          </button>
        </div>
      ) : null}
    </div>
  );
}

function PathCandidateList({
  candidates,
  onApply,
}: {
  candidates: PathCandidate[];
  onApply: (candidate: PathCandidate) => void;
}) {
  if (!candidates.length) {
    return null;
  }

  return (
    <div className="admin-path-candidates">
      {candidates.map((candidate) => (
        <div className="admin-path-candidate" key={`${candidate.value}-${candidate.note}`}>
          <code>{candidate.value}</code>
          <span>{candidate.note}</span>
          {candidate.warning ? <em>{candidate.warning}</em> : null}
          <button className="button compact" type="button" onClick={() => onApply(candidate)}>
            候補を反映
          </button>
        </div>
      ))}
    </div>
  );
}

function createPathCandidates(values: string[], basePath: string) {
  return values.map((value) => createPathCandidate(value, basePath)).filter((candidate) => candidate.value);
}

function createPathCandidate(rawValue: string, basePath: string): PathCandidate {
  const normalizedValue = rawValue.trim().replace(/\\/g, "/");
  const publicIndex = normalizedValue.toLowerCase().lastIndexOf("/public/");

  if (publicIndex >= 0) {
    return {
      value: ensureLeadingSlash(normalizedValue.slice(publicIndex + "/public".length)),
      note: "public配下パスとして変換しました",
    };
  }

  if (normalizedValue.startsWith("/")) {
    return {
      value: normalizedValue,
      note: "公開パスとして扱います",
    };
  }

  const fileName = getFileName(normalizedValue);
  const hasAbsolutePath = /^[A-Za-z]:\//.test(normalizedValue) || normalizedValue.startsWith("//");

  return {
    value: joinPublicPath(basePath, fileName),
    note: "ファイル名から候補を作成しました",
    warning: hasAbsolutePath ? "public配下ではないため、配置先に合わせて手動確認してください。" : undefined,
  };
}

function extractGalleryNumbers(values: string[]) {
  const numbers = values
    .map((value) => {
      const fileName = getFileName(value).replace(/-600(?=\.[^.]+$)/i, "");
      const preferred = fileName.match(/(?:^|[-_])(\d{1,3})(?=\.[^.]+$)/);
      const fallback = fileName.match(/(\d{1,3})/);
      const number = Number(preferred?.[1] ?? fallback?.[1] ?? 0);
      return Number.isInteger(number) && number > 0 ? number : undefined;
    })
    .filter((number): number is number => Boolean(number));

  return [...new Set(numbers)].sort((a, b) => a - b);
}

function extractGalleryPrefix(value: string) {
  const fileName = getFileName(value);
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/-600$/i, "")
    .replace(/[-_]\d{1,3}$/i, "")
    .trim();
}

function splitDroppedText(text: string) {
  return text
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function getFileInputName(file: File) {
  return (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
}

function getFileName(value: string) {
  return value.replace(/\\/g, "/").split("/").filter(Boolean).pop() ?? value;
}

function createAltFromPath(path: string) {
  return getFileName(path).replace(/\.[^.]+$/, "");
}

function ensureLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function joinPublicPath(basePath: string, fileName: string) {
  const base = ensureLeadingSlash(basePath.trim() || "/").replace(/\/+$/, "");
  return `${base}/${fileName}`;
}
