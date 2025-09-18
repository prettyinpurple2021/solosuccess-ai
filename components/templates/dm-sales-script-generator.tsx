'use client';

import { Button} from '@/components/ui/button';
import { Textarea} from '@/components/ui/textarea';
import { Label} from '@/components/ui/label';
import { Input} from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { useState} from 'react';
import { useTemplateSave} from '@/hooks/use-template-save';
import { Save, MessageSquare, Copy} from 'lucide-react';

export function DmSalesScriptGenerator() {
  const [persona, setPersona] = useState('');
  const [offerDetails, setOfferDetails] = useState('');
  const [platform, setPlatform] = useState('');
  const [tone, setTone] = useState('');
  const [scripts, setScripts] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [industry, setIndustry] = useState('');
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [generatedMetadata, setGeneratedMetadata] = useState<any>(null);
  
  const { saveTemplate, isSaving } = useTemplateSave();

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/templates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'sales-script',
          persona,
          offerDetails,
          platform,
          tone,
          industry: industry || undefined,
          painPoints: painPoints.length > 0 ? painPoints : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate scripts');
      }

      const result = await response.json();
      
      if (result.success && result.content) {
        // Extract scripts from AI response
        const generatedScripts = result.content.map((item: any) => item.script || item);
        setScripts(generatedScripts);
        
        // Store metadata for saving
        setGeneratedMetadata({
          ...result.metadata,
          templateType: result.templateType,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating scripts:', error);
      
      // Fallback to sample scripts
      const fallbackScripts = [
        `Hey [Name]! I noticed you're passionate about [topic/industry]. I help ${persona} achieve [outcome] through ${offerDetails}. Would you be interested in learning more about how [specific benefit]?`,
        `Hi [Name], your content about [specific topic] really resonated with me! I work with ${persona} to [solve problem]. I'd love to share a quick strategy that could help you [specific outcome]. Mind if I send it over?`,
        `[Name], I saw your post about [challenge/topic]. I've actually helped other ${persona} overcome this exact issue with [solution approach]. Would you be open to a quick chat about it?`,
      ];
      setScripts(fallbackScripts);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    const templateData = {
      persona,
      offerDetails,
      platform,
      tone,
      scripts,
      dateGenerated: new Date().toISOString(),
    };

    const saveTitle = title || `DM Scripts for ${persona || 'Target Audience'}`;
    
    await saveTemplate('dm-sales-script-generator', templateData, saveTitle, `${scripts.length} scripts generated for ${platform || 'social media'}`);
  };

  const copyScript = (script: string) => {
    navigator.clipboard.writeText(script);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">DM Sales Script Generator</h3>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Save as..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-48"
          />
          <Button onClick={handleSave} disabled={isSaving || scripts.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save to Briefcase'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="persona">Target Persona</Label>
            <Textarea
              id="persona"
              placeholder="Describe your ideal customer (e.g., busy entrepreneurs, fitness coaches, small business owners...)"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="offer">Offer Details</Label>
            <Textarea
              id="offer"
              placeholder="What are you selling? What specific problem does it solve? What&apos;s the main benefit?"
              value={offerDetails}
              onChange={(e) => setOfferDetails(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              placeholder="Instagram, LinkedIn, TikTok, etc."
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="tone">Desired Tone</Label>
            <Input
              id="tone"
              placeholder="Casual, professional, friendly, direct, etc."
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            />
          </div>

          <Button onClick={handleGenerate} className="w-full">
            Generate DM Scripts
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Generated Scripts</h4>
          {scripts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Fill out the form and click "Generate DM Scripts" to create personalized scripts
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {scripts.map((script, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      Script #{index + 1}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyScript(script)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm">{script}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 