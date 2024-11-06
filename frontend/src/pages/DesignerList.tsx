import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Eye, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

interface Designer {
  id: number;
  userName?: string;
  email?: string;
  roleId: number;
}

interface Design {
  designId: number;
  designInput: string;
  designTitle: string;
  description?: string;
  createdById: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

const DesignersPage = () => {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [designerDesigns, setDesignerDesigns] = useState<Design[]>([]);

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch designers');
      }
      const data = await response.json();
      const designersList = data.filter((user: Designer) => user.roleId === 2);
      setDesigners(designersList);
      setError(null);
    } catch (err) {
      setError('Failed to load designers');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDesignerDesigns = async (designer: Designer) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/designs');
      if (!response.ok) {
        throw new Error('Failed to fetch designs');
      }
      const data = await response.json();
      const designerDesignsList = data.filter((design: Design) => 
        design.createdByName.toLowerCase() === designer.userName?.toLowerCase()
      );
      setDesignerDesigns(designerDesignsList);
      setError(null);
    } catch (err) {
      setError('Failed to load designs');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDesigners = designers.filter(designer => {
    const searchLower = searchQuery.toLowerCase();
    return designer.userName?.toLowerCase().includes(searchLower) || 
           designer.email?.toLowerCase().includes(searchLower);
  });

  const handleGoToDashboard = () => {
    window.history.back();
  };

  const handleViewDesigns = (designer: Designer) => {
    setSelectedDesigner(designer);
    fetchDesignerDesigns(designer);
    setSearchQuery(''); // Clear search when selecting a designer
  };

  const handleBackToDesigners = () => {
    setSelectedDesigner(null);
    setDesignerDesigns([]);
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">{error}</div>
        <Button onClick={fetchDesigners} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={handleGoToDashboard} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Designers</h1>
      </div>

      {!selectedDesigner && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search designers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {!selectedDesigner ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDesigners.length > 0 ? (
                filteredDesigners.map((designer) => (
                  <Card key={designer.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{designer.userName || 'Unnamed Designer'}</h3>
                          <p className="text-sm text-gray-500">{designer.email || 'No email provided'}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDesigns(designer)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Designs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center text-gray-500 col-span-full">
                  No designers found matching your search.
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToDesigners}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Close
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {selectedDesigner.userName}'s Designs
                  </h2>
                </div>
              </div>

              {designerDesigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {designerDesigns.map((design) => (
                    <Card key={design.designId} className="overflow-hidden">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{design.designTitle}</h3>
                        <p className="text-sm text-gray-500">{design.description || 'No description provided'}</p>
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">Created at: {new Date(design.createdAt).toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Updated at: {new Date(design.updatedAt).toLocaleString()}</p>
                        </div>
                        <div className="mt-4">
                          <img src={design.designInput} alt={design.designTitle} className="w-full h-auto" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No designs found for this designer.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DesignersPage;