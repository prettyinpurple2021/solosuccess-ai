import { Connection, Client } from '@temporalio/client';

async function testConnection() {
  console.log('🔍 Testing Temporal connection...');
  
  try {
    // Try to connect to Temporal server using environment variables
    const connection = await Connection.connect({
      address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
      // Add TLS and API key configuration for Temporal Cloud
      ...(process.env.TEMPORAL_ADDRESS?.includes('temporal.io') && {
        tls: true,
        apiKey: process.env.TEMPORAL_API_KEY,
      }),
    });

    const client = new Client({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    });

    console.log('✅ Successfully connected to Temporal server!');
    console.log('🌐 Server address:', process.env.TEMPORAL_ADDRESS || 'localhost:7233');
    console.log('📋 Namespace:', process.env.TEMPORAL_NAMESPACE || 'default');
    
    // Test basic connectivity
    try {
      await client.workflowService.getSystemInfo({});
      console.log('✅ Server is responding to requests');
    } catch (error) {
      console.log('⚠️  Server connected but may not be fully ready');
    }

    await connection.close();
    console.log('🎉 Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to connect to Temporal server:');
    console.error('   Error:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Make sure Temporal server is running');
    console.log('   2. Check if port 7233 is accessible');
    console.log('   3. Try: temporal server start-dev');
    console.log('   4. Or use Docker: docker run -p 7233:7233 -p 8080:8080 temporalio/auto-setup:latest');
    process.exit(1);
  }
}

testConnection();
