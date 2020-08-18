import React from 'react';
import { Layout } from 'antd';
import styles from './indexPage.css';

function IndexPage() {
    return (
        <Layout>
            <Layout.Header className={styles.header}>
                header
            </Layout.Header>
            <Layout.Content className={styles.content}>
                content
            </Layout.Content>
            <Layout.Footer className={styles.footer}>
                footer
            </Layout.Footer>
        </Layout>
    );
}

export default IndexPage;
