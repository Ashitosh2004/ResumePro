import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { parseResumeFile, validateFileType, formatFileSize } from '@/lib/fileParser';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
    onTextExtracted: (text: string) => void;
    onError?: (error: string) => void;
}

export const FileUpload = ({ onTextExtracted, onError }: FileUploadProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleFile = useCallback(async (file: File) => {
        setError('');
        setUploadedFile(null);
        setExtractedText('');

        // Validate file type
        const validation = validateFileType(file);
        if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            onError?.(validation.error || 'Invalid file');
            return;
        }

        setUploadedFile(file);
        setIsProcessing(true);

        try {
            const text = await parseResumeFile(file);
            setExtractedText(text);
            onTextExtracted(text);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to parse file';
            setError(errorMessage);
            onError?.(errorMessage);
            setUploadedFile(null);
        } finally {
            setIsProcessing(false);
        }
    }, [onTextExtracted, onError]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    }, [handleFile]);

    const handleClear = useCallback(() => {
        setUploadedFile(null);
        setExtractedText('');
        setError('');
    }, []);

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            {!uploadedFile && !extractedText && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center
            transition-all duration-300 cursor-pointer
            ${isDragging
                            ? 'border-primary bg-primary/5 scale-[1.02]'
                            : 'border-border hover:border-primary/50 hover:bg-accent/30'
                        }
          `}
                >
                    <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isProcessing}
                    />

                    <div className="flex flex-col items-center gap-4">
                        <div className={`
              w-16 h-16 rounded-full flex items-center justify-center
              transition-all duration-300
              ${isDragging ? 'bg-primary text-primary-foreground scale-110' : 'bg-primary/10 text-primary'}
            `}>
                            {isProcessing ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                <Upload className="w-8 h-8" />
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {isProcessing ? 'Processing file...' : 'Drop your resume here'}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                                or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Supports: PDF, DOCX, TXT • Max size: 5MB
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Success State */}
            {uploadedFile && extractedText && !error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-green-500/30 bg-green-500/5 rounded-2xl p-6"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-foreground">File uploaded successfully</h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClear}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                <FileText className="w-4 h-4" />
                                <span className="truncate">{uploadedFile.name}</span>
                                <span className="text-xs">({formatFileSize(uploadedFile.size)})</span>
                            </div>

                            <div className="text-sm text-green-600 dark:text-green-400">
                                ✓ Extracted {extractedText.length.toLocaleString()} characters
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-destructive/30 bg-destructive/5 rounded-2xl p-6"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-destructive" />
                        </div>

                        <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-2">Upload failed</h4>
                            <p className="text-sm text-muted-foreground mb-4">{error}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClear}
                            >
                                Try again
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
