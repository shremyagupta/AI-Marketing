"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TestAPIPage() {
  const [envTestResult, setEnvTestResult] = useState<any>(null);
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [isLoadingEnv, setIsLoadingEnv] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  const testEnvironment = async () => {
    setIsLoadingEnv(true);
    try {
      const response = await fetch('/api/env-test');
      const data = await response.json();
      setEnvTestResult(data);
    } catch (error) {
      setEnvTestResult({ error: 'Failed to test environment', details: error });
    } finally {
      setIsLoadingEnv(false);
    }
  };

  const testAPI = async () => {
    setIsLoadingAPI(true);
    try {
      const response = await fetch('/api/test-perplexity');
      const data = await response.json();
      setApiTestResult(data);
    } catch (error) {
      setApiTestResult({ error: 'Failed to test API', details: error });
    } finally {
      setIsLoadingAPI(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Environment Variables Test */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables Test</CardTitle>
            <CardDescription>
              Test if your environment variables are being loaded correctly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testEnvironment} 
              disabled={isLoadingEnv}
              variant="outline"
              className="w-full"
            >
              {isLoadingEnv ? 'Testing...' : 'Test Environment Variables'}
            </Button>

            {envTestResult && (
              <div className="mt-4 p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Environment Test Results:</h3>
                <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                  {JSON.stringify(envTestResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Perplexity API Test */}
        <Card>
          <CardHeader>
            <CardTitle>Perplexity API Test</CardTitle>
            <CardDescription>
              Test your Perplexity API integration to ensure it's working correctly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testAPI} 
              disabled={isLoadingAPI}
              className="w-full"
            >
              {isLoadingAPI ? 'Testing...' : 'Test Perplexity API'}
            </Button>

            {apiTestResult && (
              <div className="mt-4 p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">API Test Results:</h3>
                <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                  {JSON.stringify(apiTestResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>
              Current status of your Perplexity API integration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span>Environment Variables:</span>
                <span className={envTestResult?.environment?.PERPLEXITY_API_KEY?.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                  {envTestResult?.environment?.PERPLEXITY_API_KEY || 'Not tested'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>API Connection:</span>
                <span className={apiTestResult?.success ? 'text-green-600' : 'text-red-600'}>
                  {apiTestResult ? (apiTestResult.success ? '✅ Working' : '❌ Failed') : 'Not tested'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
