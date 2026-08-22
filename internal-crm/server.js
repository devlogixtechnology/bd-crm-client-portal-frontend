import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Mock Data
let leads = [
  {id:1, name:'Sarah Johnson', company:'Acme Corporation', email:'sarah@acme.com', phone:'+1 555 013 2201', value:12500, source:'Website', assignee:'Devlogics', stage: 'contacted'},
  {id:2, name:'Michael Chen', company:'Nova Labs', email:'michael@novalabs.com', phone:'+1 555 013 2202', value:8400, source:'Referral', assignee:'Devlogics', stage: 'contacted'},
  {id:3, name:'Emily Davis', company:'Brightside', email:'emily@brightside.com', phone:'+1 555 013 2203', value:15200, source:'LinkedIn', assignee:'Devlogics', stage: 'meeting'},
  {id:4, name:'James Wilson', company:'Orbit Systems', email:'james@orbit.io', phone:'+1 555 013 2204', value:6900, source:'Website', assignee:'Devlogics', stage: 'meeting'},
  {id:5, name:'Olivia Brown', company:'Vertex Group', email:'olivia@vertex.co', phone:'+1 555 013 2205', value:22000, source:'Referral', assignee:'Devlogics', stage: 'proposal'},
  {id:6, name:'Daniel Miller', company:'Apex Digital', email:'daniel@apex.digital', phone:'+1 555 013 2206', value:31500, source:'Website', assignee:'Devlogics', stage: 'proposal'},
  {id:7, name:'Noah Taylor', company:'Northstar', email:'noah@northstar.co', phone:'+1 555 013 2207', value:18750, source:'Referral', assignee:'Devlogics', stage: 'closed'},
  {id:8, name:'Emma Williams', company:'Pioneer Labs', email:'emma@pioneer.io', phone:'+1 555 013 2208', value:4500, source:'Website', assignee:'Devlogics', stage: 'lost'}
];

// 1. Mock Authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return res.json({ token: 'mock-jwt-token-12345', user: { name: 'Admin', role: 'admin' } });
  }
  return res.status(401).json({ error: 'Invalid credentials. Use admin/admin' });
});

// Auth middleware for protected routes
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer mock-jwt-token-12345') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// 2. GET /leads
app.get('/api/leads', authenticate, (req, res) => {
  // Add a slight delay to simulate network
  setTimeout(() => {
    res.json(leads);
  }, 500);
});

// (Optional) Update Lead Stage
app.patch('/api/leads/:id/stage', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const { stage } = req.body;
  const lead = leads.find(l => l.id === id);
  if (lead) {
    lead.stage = stage;
    res.json(lead);
  } else {
    res.status(404).json({ error: 'Lead not found' });
  }
});

// Catch-all route to serve index.html for SPA
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
