const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json());

let companyData = [];
let lastDataLoad = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

async function loadCompanyData() {
  try {
    const now = Date.now();
    if (companyData.length > 0 && lastDataLoad && (now - lastDataLoad) < CACHE_DURATION) {
      return companyData;
    }

    const dataPath = path.join(__dirname, '../data/data.json');
    const rawData = await fs.readFile(dataPath, 'utf8');
    companyData = JSON.parse(rawData);
    lastDataLoad = now;
    
    console.log(`Loaded ${companyData.length} company records`);
    return companyData;
  } catch (error) {
    console.error('Error loading company data:', error);
    throw new Error('Failed to load company data');
  }
}

function findCompanyByDomain(domain, data) {
  const cleanDomain = domain.replace('www.', '').toLowerCase();
  
  return data.find(company => {
    const companyDomain = company.domain.toLowerCase();
    return cleanDomain.includes(companyDomain) || companyDomain.includes(cleanDomain);
  });
}

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    recordsCount: companyData.length 
  });
});

app.get('/api/companies', async (req, res) => {
  try {
    const data = await loadCompanyData();
    const { limit = 50, offset = 0 } = req.query;
    
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedData = data.slice(startIndex, endIndex);
    
    res.json({
      data: paginatedData,
      total: data.length,
      offset: startIndex,
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/companies/search', async (req, res) => {
  try {
    const { domain, company } = req.query;
    
    if (!domain && !company) {
      return res.status(400).json({ error: 'Domain or company parameter required' });
    }
    
    const data = await loadCompanyData();
    let results = [];
    
    if (domain) {
      const found = findCompanyByDomain(domain, data);
      if (found) results.push(found);
    }
    
    if (company && results.length === 0) {
      results = data.filter(item => 
        item.company.toLowerCase().includes(company.toLowerCase())
      );
    }
    
    res.json({
      data: results,
      found: results.length > 0,
      query: { domain, company }
    });
  } catch (error) {
    console.error('Error searching companies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/companies/domain/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const data = await loadCompanyData();
    
    const company = findCompanyByDomain(domain, data);
    
    if (!company) {
      return res.status(404).json({ 
        error: 'Company not found for domain',
        domain: domain 
      });
    }
    
    res.json({
      data: company,
      found: true,
      domain: domain
    });
  } catch (error) {
    console.error('Error fetching company by domain:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/data/version', async (req, res) => {
  try {
    const data = await loadCompanyData();
    const stats = {
      version: '1.0.0',
      recordCount: data.length,
      lastUpdated: lastDataLoad ? new Date(lastDataLoad).toISOString() : null,
      categories: {
        carbonNeutral: data.filter(c => c.carbon_neutral).length,
        withRenewableData: data.filter(c => c.renewable_share_percent).length,
        publicCompanies: data.filter(c => !c.parent).length
      }
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting data version:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {
    await loadCompanyData();
    
    app.listen(PORT, () => {
      console.log(`Sustainability Data Service running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Company records loaded: ${companyData.length}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();